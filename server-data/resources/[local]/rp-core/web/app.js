const isFiveM = typeof window.GetParentResourceName === 'function';

const els = {
  hudPlayerName: document.getElementById('hudPlayerName'),
  hudJob: document.getElementById('hudJob'),
  hudCash: document.getElementById('hudCash'),
  hudBank: document.getElementById('hudBank'),
  rpPanel: document.getElementById('rpPanel'),
  closeBtn: document.getElementById('closeBtn'),
  feedbackBanner: document.getElementById('feedbackBanner'),
  panelName: document.getElementById('panelName'),
  panelId: document.getElementById('panelId'),
  panelJob: document.getElementById('panelJob'),
  panelSalary: document.getElementById('panelSalary'),
  panelCash: document.getElementById('panelCash'),
  panelBank: document.getElementById('panelBank'),
  transferForm: document.getElementById('transferForm'),
  targetIdInput: document.getElementById('targetIdInput'),
  amountInput: document.getElementById('amountInput'),
  noteInput: document.getElementById('noteInput'),
  txList: document.getElementById('txList'),
  devToolsBar: document.getElementById('devToolsBar'),
  devPlayerSelect: document.getElementById('devPlayerSelect'),
  devJobSelect: document.getElementById('devJobSelect'),
  devApplyJobBtn: document.getElementById('devApplyJobBtn'),
  devAddCashBtn: document.getElementById('devAddCashBtn'),
  devPaySalaryBtn: document.getElementById('devPaySalaryBtn'),
};

let activePreviewPlayerId = '1';

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`;
}

function showFeedback(feedback) {
  if (!feedback || !feedback.message) {
    els.feedbackBanner.classList.add('hidden');
    return;
  }
  els.feedbackBanner.textContent = feedback.message;
  els.feedbackBanner.className = `feedback ${feedback.ok ? 'ok' : 'error'}`;
}

function renderTransactions(transactions) {
  els.txList.innerHTML = '';
  if (!Array.isArray(transactions) || transactions.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'tx-empty';
    empty.textContent = 'Chưa có giao dịch nào.';
    els.txList.appendChild(empty);
    return;
  }

  for (const tx of transactions) {
    const li = document.createElement('li');
    li.className = 'tx-item';

    const meta = document.createElement('div');
    meta.className = 'tx-meta';

    const noteEl = document.createElement('span');
    noteEl.className = 'tx-note';
    noteEl.textContent = tx.note || tx.type;

    const timeEl = document.createElement('span');
    timeEl.className = 'tx-time';
    timeEl.textContent = `${tx.account.toUpperCase()} • ${new Date(tx.timestamp).toLocaleTimeString('vi-VN')}`;

    meta.appendChild(noteEl);
    meta.appendChild(timeEl);

    const isOut = tx.type === 'transfer_out' || tx.type === 'debit';
    const amountEl = document.createElement('span');
    amountEl.className = `tx-amount ${isOut ? 'minus' : 'plus'}`;
    amountEl.textContent = `${isOut ? '-' : '+'}${formatMoney(tx.amount)}`;

    li.appendChild(meta);
    li.appendChild(amountEl);
    els.txList.appendChild(li);
  }
}

function renderProfile(profile) {
  if (!profile) return;

  els.hudPlayerName.textContent = `${profile.name} #${profile.id}`;
  els.hudJob.textContent = profile.jobLabel;
  els.hudCash.textContent = formatMoney(profile.cash);
  els.hudBank.textContent = formatMoney(profile.bank);

  els.panelName.textContent = profile.name;
  els.panelId.textContent = `Server ID: #${profile.id}`;
  els.panelJob.textContent = `${profile.jobLabel} (${profile.jobGradeLabel})`;
  els.panelSalary.textContent = `Lương: ${formatMoney(profile.salary)} / chu kỳ`;
  els.panelCash.textContent = formatMoney(profile.cash);
  els.panelBank.textContent = formatMoney(profile.bank);

  renderTransactions(profile.transactions);
}

async function nuiPost(endpoint, payload = {}) {
  const resourceName = window.GetParentResourceName();
  const resp = await fetch(`https://${resourceName}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(payload),
  });
  return resp.json();
}

let nuiFallbackPromise = null;

function loadNuiFallbackClient() {
  if (typeof window.handleStaticRpApiAsync === 'function') {
    return Promise.resolve();
  }
  if (!nuiFallbackPromise) {
    nuiFallbackPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '../shared-runtime/browser-api-fallback.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Không thể tải static fallback runtime.'));
      document.head.appendChild(script);
    });
  }
  return nuiFallbackPromise;
}

async function previewApi(path, body = null) {
  const cleanPath = String(path).replace(/^\/?api\//, '');
  const options = body
    ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    : { method: 'GET' };

  try {
    const resp = await fetch(`../api/${cleanPath}`, options);
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await resp.json();
    }
  } catch {
    // Fallback khi mở /nui/ trên GitHub Pages hoặc hosting tĩnh
  }

  await loadNuiFallbackClient();
  return window.handleStaticRpApiAsync(cleanPath, body, '../shared-runtime');
}

function populatePreviewSelectors(players, jobs, currentProfile) {
  els.devPlayerSelect.innerHTML = '';
  for (const p of players) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `#${p.id} - ${p.name}`;
    opt.selected = p.id === currentProfile.id;
    els.devPlayerSelect.appendChild(opt);
  }

  els.devJobSelect.innerHTML = '';
  for (const [jobId, jobDef] of Object.entries(jobs)) {
    const opt = document.createElement('option');
    opt.value = jobId;
    opt.textContent = `${jobDef.label} (${formatMoney(jobDef.salary)})`;
    opt.selected = jobId === currentProfile.job;
    els.devJobSelect.appendChild(opt);
  }
}

async function refreshPreviewState(feedback = null) {
  const data = await previewApi(`/api/state?playerId=${encodeURIComponent(activePreviewPlayerId)}`);
  renderProfile(data.profile);
  populatePreviewSelectors(data.players, data.jobs, data.profile);
  if (feedback) {
    showFeedback(feedback);
  }
}

els.transferForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    senderId: activePreviewPlayerId,
    targetId: els.targetIdInput.value.trim(),
    amount: Number(els.amountInput.value),
    note: els.noteInput.value.trim(),
  };

  if (isFiveM) {
    await nuiPost('transferMoney', payload);
    els.amountInput.value = '';
    els.noteInput.value = '';
    return;
  }

  const res = await previewApi('/api/transfer', payload);
  await refreshPreviewState({
    ok: res.ok,
    message: res.ok ? 'Chuyển khoản thành công!' : res.error,
  });
  if (res.ok) {
    els.amountInput.value = '';
    els.noteInput.value = '';
  }
});

els.closeBtn.addEventListener('click', () => {
  if (isFiveM) {
    nuiPost('closePanel');
  } else {
    els.rpPanel.classList.toggle('hidden');
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isFiveM && !els.rpPanel.classList.contains('hidden')) {
    nuiPost('closePanel');
  }
  if (event.key === 'F5' && !isFiveM) {
    event.preventDefault();
    els.rpPanel.classList.toggle('hidden');
  }
});

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'togglePanel') {
    els.rpPanel.classList.toggle('hidden', !data.open);
    if (data.open) {
      nuiPost('requestRefresh');
    }
  } else if (data.type === 'syncState') {
    renderProfile(data.profile);
    if (data.feedback) {
      showFeedback(data.feedback);
    }
  }
});

if (!isFiveM) {
  document.body.classList.add('browser-preview');
  els.rpPanel.classList.remove('hidden');
  els.devToolsBar.classList.remove('hidden');

  els.devPlayerSelect.addEventListener('change', async () => {
    activePreviewPlayerId = els.devPlayerSelect.value;
    els.targetIdInput.value = activePreviewPlayerId === '1' ? '2' : '1';
    await refreshPreviewState({ ok: true, message: `Đang xem hồ sơ ID #${activePreviewPlayerId}` });
  });

  els.devApplyJobBtn.addEventListener('click', async () => {
    const res = await previewApi('/api/setjob', {
      playerId: activePreviewPlayerId,
      jobId: els.devJobSelect.value,
    });
    await refreshPreviewState({
      ok: res.ok,
      message: res.ok ? `Đã đổi nghề thành ${res.profile.jobLabel}.` : res.error,
    });
  });

  els.devAddCashBtn.addEventListener('click', async () => {
    const res = await previewApi('/api/addcash', {
      playerId: activePreviewPlayerId,
      amount: 1000,
    });
    await refreshPreviewState({
      ok: res.ok,
      message: res.ok ? 'Đã cộng +$1,000 tiền mặt test.' : res.error,
    });
  });

  els.devPaySalaryBtn.addEventListener('click', async () => {
    const res = await previewApi('/api/salary', {});
    await refreshPreviewState({
      ok: true,
      message: `Đã phát lương cho ${res.payoutCount} người chơi đang online.`,
    });
  });

  els.targetIdInput.value = '2';
  refreshPreviewState();
}
