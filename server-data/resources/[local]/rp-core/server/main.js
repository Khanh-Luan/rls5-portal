const config = globalThis.RpConfig;
const EconomyStore = globalThis.RpEconomyStore;

const store = new EconomyStore({ config });

function notifyPlayer(targetSrc, message, level = 'info') {
  const prefix = level === 'error' ? '^1[RP-Core]^7' : '^2[RP-Core]^7';
  if (Number(targetSrc) === 0) {
    console.log(`${prefix} ${message}`);
    return;
  }
  emitNet('chat:addMessage', targetSrc, {
    args: ['RP-Core', message],
  });
}

function syncPlayerHud(targetSrc, feedback = null) {
  const profile = store.getProfile(targetSrc);
  if (!profile) return;
  emitNet('rp-core:client:syncProfile', targetSrc, {
    profile,
    jobs: config.jobs,
    feedback,
  });
}

// Khởi tạo dữ liệu cho các player đã có sẵn nếu resource được restart nóng
on('onResourceStart', (resourceName) => {
  if (resourceName !== GetCurrentResourceName()) return;
  const players = getPlayers();
  for (const pid of players) {
    store.ensurePlayer(pid, GetPlayerName(pid) || `Player ${pid}`);
    syncPlayerHud(pid);
  }
  console.log(`[rp-core] Started successfully (${players.length} active players synced).`);
});

on('playerJoining', () => {
  const src = global.source;
  const name = GetPlayerName(src) || `Player ${src}`;
  store.ensurePlayer(src, name);
  syncPlayerHud(src);
});

on('playerDropped', () => {
  const src = global.source;
  store.removePlayer(src);
});

onNet('rp-core:server:requestSync', () => {
  const src = global.source;
  store.ensurePlayer(src, GetPlayerName(src) || `Player ${src}`);
  syncPlayerHud(src);
});

onNet('rp-core:server:transferMoney', (payload) => {
  const src = global.source;
  if (!payload || typeof payload !== 'object') {
    syncPlayerHud(src, { ok: false, message: 'Dữ liệu chuyển khoản không hợp lệ.' });
    return;
  }

  const result = store.transferBank(src, payload.targetId, payload.amount, payload.note);
  if (!result.ok) {
    syncPlayerHud(src, { ok: false, message: result.error });
    notifyPlayer(src, result.error, 'error');
    return;
  }

  syncPlayerHud(src, {
    ok: true,
    message: `Đã chuyển $${Number(payload.amount).toLocaleString('en-US')} cho #${payload.targetId}.`,
  });
  syncPlayerHud(payload.targetId, {
    ok: true,
    message: `Bạn vừa nhận $${Number(payload.amount).toLocaleString('en-US')} từ #${src}.`,
  });
});

RegisterCommand(
  'balance',
  (source) => {
    if (source === 0) {
      console.log(JSON.stringify(store.listPlayers(), null, 2));
      return;
    }
    const profile = store.ensurePlayer(source, GetPlayerName(source));
    notifyPlayer(
      source,
      `Tiền mặt: $${profile.cash.toLocaleString('en-US')} | Ngân hàng: $${profile.bank.toLocaleString('en-US')} | Nghề: ${profile.jobLabel}`
    );
  },
  false
);

RegisterCommand(
  'pay',
  (source, args) => {
    if (source === 0) {
      console.log('[rp-core] Lệnh /pay chỉ dùng cho người chơi trong game.');
      return;
    }
    const [targetId, amount] = args;
    if (!targetId || !amount) {
      notifyPlayer(source, 'Cú pháp: /pay <id> <so_tien>', 'error');
      return;
    }
    const result = store.transferBank(source, targetId, amount, 'Lệnh /pay');
    if (!result.ok) {
      notifyPlayer(source, result.error, 'error');
      return;
    }
    syncPlayerHud(source);
    syncPlayerHud(targetId);
    notifyPlayer(source, `Đã chuyển $${Number(amount).toLocaleString('en-US')} cho ID ${targetId}.`);
    notifyPlayer(targetId, `Bạn nhận được $${Number(amount).toLocaleString('en-US')} từ ID ${source}.`);
  },
  false
);

RegisterCommand(
  'setjob',
  (source, args) => {
    const [targetId, jobId, grade = 0] = args;
    if (!targetId || !jobId) {
      notifyPlayer(source, 'Cú pháp: /setjob <id> <ma_nghe> [cap_bac]', 'error');
      return;
    }
    const result = store.setJob(targetId, jobId, Number(grade));
    if (!result.ok) {
      notifyPlayer(source, result.error, 'error');
      return;
    }
    syncPlayerHud(targetId, {
      ok: true,
      message: `Nghề nghiệp đã đổi thành ${result.profile.jobLabel} (${result.profile.jobGradeLabel}).`,
    });
    notifyPlayer(source, `Đã đặt nghề của ID ${targetId} thành ${result.profile.jobLabel}.`);
  },
  true // Chỉ Admin / Server Console (hoặc ACE group.admin)
);

RegisterCommand(
  'addcash',
  (source, args) => {
    const [targetId, amount] = args;
    if (!targetId || !amount) {
      notifyPlayer(source, 'Cú pháp: /addcash <id> <so_tien>', 'error');
      return;
    }
    const result = store.addMoney(targetId, 'cash', amount, 'Admin cấp tiền test');
    if (!result.ok) {
      notifyPlayer(source, result.error, 'error');
      return;
    }
    syncPlayerHud(targetId);
    notifyPlayer(source, `Đã cộng $${Number(amount).toLocaleString('en-US')} tiền mặt cho ID ${targetId}.`);
  },
  true
);

setInterval(() => {
  const payouts = store.paySalaries();
  for (const payout of payouts) {
    syncPlayerHud(payout.id, {
      ok: true,
      message: `Nhận lương +$${payout.amount.toLocaleString('en-US')} vào ngân hàng.`,
    });
  }
}, config.salaryIntervalMs);

// Exports chuẩn để các resource Lua/JS khác có thể gọi trực tiếp
exports('getPlayerProfile', (playerId) => store.getProfile(playerId));
exports('setPlayerJob', (playerId, jobId, grade) => store.setJob(playerId, jobId, grade));
exports('addPlayerMoney', (playerId, accountType, amount, note) =>
  store.addMoney(playerId, accountType, amount, note)
);
exports('removePlayerMoney', (playerId, accountType, amount, note) =>
  store.removeMoney(playerId, accountType, amount, note)
);
