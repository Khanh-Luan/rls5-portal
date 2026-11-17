const config = globalThis.RpConfig || require('../shared/config.js');

/**
 * Validate positive safe integers to prevent float/overflow/NaN exploits in economy operations.
 */
function parsePositiveInt(value) {
  const num = Number(value);
  if (!Number.isSafeInteger(num) || num <= 0) {
    return null;
  }
  return num;
}

function sanitizeNote(note) {
  if (typeof note !== 'string') return '';
  return note.trim().slice(0, 120);
}

/**
 * In-memory authoritative RP economy & job state manager.
 * Designed to run identically inside FXServer and local Node.js test/preview runners.
 */
class EconomyStore {
  constructor(options = {}) {
    this.config = options.config || config;
    this.players = new Map();
    this.nextTxId = 1;
  }

  /**
   * Register or update a player session when joining the server.
   */
  ensurePlayer(playerId, name = 'Công dân') {
    const id = String(playerId);
    const existing = this.players.get(id);
    if (existing) {
      if (name && name !== existing.name) {
        existing.name = String(name).slice(0, 48);
      }
      return this.getProfile(id);
    }

    const defaultJobId = this.config.defaultJob;
    const player = {
      id,
      name: String(name || `Player ${id}`).slice(0, 48),
      cash: this.config.startingCash,
      bank: this.config.startingBank,
      job: defaultJobId,
      jobGrade: 0,
      transactions: [],
    };
    this.players.set(id, player);
    return this.getProfile(id);
  }

  removePlayer(playerId) {
    return this.players.delete(String(playerId));
  }

  getProfile(playerId) {
    const player = this.players.get(String(playerId));
    if (!player) return null;

    const jobDef = this.config.jobs[player.job] || this.config.jobs[this.config.defaultJob];
    const gradeName = jobDef.grades[player.jobGrade] || jobDef.grades[0] || '';

    return {
      id: player.id,
      name: player.name,
      cash: player.cash,
      bank: player.bank,
      job: player.job,
      jobLabel: jobDef.label,
      jobGrade: player.jobGrade,
      jobGradeLabel: gradeName,
      salary: jobDef.salary,
      transactions: [...player.transactions],
    };
  }

  listPlayers() {
    return Array.from(this.players.keys()).map((id) => this.getProfile(id));
  }

  _recordTransaction(player, tx) {
    player.transactions.unshift({
      id: this.nextTxId++,
      timestamp: new Date().toISOString(),
      ...tx,
    });
    if (player.transactions.length > this.config.maxTransactionHistory) {
      player.transactions.length = this.config.maxTransactionHistory;
    }
  }

  addMoney(playerId, accountType, rawAmount, note = 'Cộng tiền') {
    if (accountType !== 'cash' && accountType !== 'bank') {
      return { ok: false, error: 'Loại tài khoản không hợp lệ.' };
    }
    const amount = parsePositiveInt(rawAmount);
    if (!amount) {
      return { ok: false, error: 'Số tiền phải là số nguyên dương.' };
    }

    const player = this.players.get(String(playerId));
    if (!player) {
      return { ok: false, error: 'Không tìm thấy người chơi.' };
    }

    player[accountType] += amount;
    this._recordTransaction(player, {
      type: 'credit',
      account: accountType,
      amount,
      note: sanitizeNote(note),
    });

    return { ok: true, profile: this.getProfile(playerId) };
  }

  removeMoney(playerId, accountType, rawAmount, note = 'Trừ tiền') {
    if (accountType !== 'cash' && accountType !== 'bank') {
      return { ok: false, error: 'Loại tài khoản không hợp lệ.' };
    }
    const amount = parsePositiveInt(rawAmount);
    if (!amount) {
      return { ok: false, error: 'Số tiền phải là số nguyên dương.' };
    }

    const player = this.players.get(String(playerId));
    if (!player) {
      return { ok: false, error: 'Không tìm thấy người chơi.' };
    }
    if (player[accountType] < amount) {
      return { ok: false, error: 'Số dư không đủ.' };
    }

    player[accountType] -= amount;
    this._recordTransaction(player, {
      type: 'debit',
      account: accountType,
      amount,
      note: sanitizeNote(note),
    });

    return { ok: true, profile: this.getProfile(playerId) };
  }

  transferBank(senderId, targetId, rawAmount, note = '') {
    const fromId = String(senderId);
    const toId = String(targetId);

    if (fromId === toId) {
      return { ok: false, error: 'Không thể tự chuyển khoản cho chính mình.' };
    }

    const amount = parsePositiveInt(rawAmount);
    if (!amount) {
      return { ok: false, error: 'Số tiền chuyển phải là số nguyên dương.' };
    }
    if (amount > this.config.maxTransferAmount) {
      return {
        ok: false,
        error: `Vượt hạn mức mỗi lần chuyển ($${this.config.maxTransferAmount.toLocaleString('en-US')}).`,
      };
    }

    const sender = this.players.get(fromId);
    const receiver = this.players.get(toId);
    if (!sender) {
      return { ok: false, error: 'Tài khoản người gửi không tồn tại.' };
    }
    if (!receiver) {
      return { ok: false, error: `Không tìm thấy người chơi ID ${toId}.` };
    }
    if (sender.bank < amount) {
      return { ok: false, error: 'Số dư ngân hàng không đủ.' };
    }

    const cleanNote = sanitizeNote(note);
    sender.bank -= amount;
    receiver.bank += amount;

    this._recordTransaction(sender, {
      type: 'transfer_out',
      account: 'bank',
      amount,
      counterparty: `${receiver.name} (#${toId})`,
      note: cleanNote || `Chuyển tới #${toId}`,
    });
    this._recordTransaction(receiver, {
      type: 'transfer_in',
      account: 'bank',
      amount,
      counterparty: `${sender.name} (#${fromId})`,
      note: cleanNote || `Nhận từ #${fromId}`,
    });

    return {
      ok: true,
      sender: this.getProfile(fromId),
      receiver: this.getProfile(toId),
    };
  }

  setJob(playerId, jobId, grade = 0) {
    const jobDef = this.config.jobs[jobId];
    if (!jobDef) {
      return { ok: false, error: `Nghề "${jobId}" không tồn tại.` };
    }

    const player = this.players.get(String(playerId));
    if (!player) {
      return { ok: false, error: 'Không tìm thấy người chơi.' };
    }

    const parsedGrade = Number.isSafeInteger(Number(grade)) ? Number(grade) : 0;
    const boundedGrade = Math.max(0, Math.min(parsedGrade, jobDef.grades.length - 1));

    player.job = jobId;
    player.jobGrade = boundedGrade;

    return { ok: true, profile: this.getProfile(playerId) };
  }

  paySalaries() {
    const payouts = [];
    for (const [id, player] of this.players.entries()) {
      const jobDef = this.config.jobs[player.job];
      if (!jobDef || jobDef.salary <= 0) continue;

      player.bank += jobDef.salary;
      this._recordTransaction(player, {
        type: 'salary',
        account: 'bank',
        amount: jobDef.salary,
        note: `Lương ${jobDef.label}`,
      });
      payouts.push({ id, amount: jobDef.salary, profile: this.getProfile(id) });
    }
    return payouts;
  }
}

globalThis.RpEconomyStore = EconomyStore;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EconomyStore, parsePositiveInt };
}
