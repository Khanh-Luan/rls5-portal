const SHOWCASE_SLIDES = [
  {
    id: 'rp-economy',
    tag: 'KINH TẾ & NGÂN HÀNG',
    title: 'Hệ thống Ví Tiền & Chuyển Khoản Thời Gian Thực',
    subtitle: 'Bảo vệ chống số âm, ghi nhận lịch sử giao dịch và phát lương theo chu kỳ nghề nghiệp.',
    bg: 'linear-gradient(135deg, #0b2459 0%, #050d24 65%, #0c3d52 100%)',
  },
  {
    id: 'nui-hud',
    tag: 'GIAO DIỆN NUI',
    title: 'HUD & Hồ Sơ Công Dân Phím F5 Trong Game',
    subtitle: 'Thiết kế Midnight-Navy đồng bộ giữa cổng thông tin Web và giao diện CEF trong GTA V.',
    bg: 'linear-gradient(135deg, #102a68 0%, #07102a 65%, #193b6b 100%)',
  },
  {
    id: 'dev-ready',
    tag: 'TEST KHÔNG CẦN GAME',
    title: 'Môi Trường Dev & Tester Tách Biệt Chuẩn FXServer',
    subtitle: 'Code server Lua/JS và UI chạy thử trực tiếp trên trình duyệt trước khi tester vào F8.',
    bg: 'linear-gradient(135deg, #072c4a 0%, #040a1d 65%, #163063 100%)',
  },
];

const NEWS_POSTS = [
  {
    id: 'patch-10',
    badge: 'CẬP NHẬT CORE',
    thumbTitle: 'RLS5 CORE v1.0',
    title: 'Ra mắt nền tảng Kinh tế & Nghề nghiệp RLS5',
    summary:
      'Hoàn thiện bộ khung Royal Los Santos 5 (RLS5) theo chuẩn FXServer, hỗ trợ chuyển khoản liên người chơi và tự động phát lương.',
    date: '17/11/2026',
    bg: 'linear-gradient(135deg, #0e3478 0%, #071232 100%)',
    detail:
      'Resource rp-core của RLS5 sử dụng chung module server/economy.js cho cả FXServer thật và trình duyệt preview. Mọi giao dịch chuyển tiền đều kiểm tra số nguyên dương, chống tự chuyển và giới hạn hạn mức để tránh lỗi khai thác tiền.',
  },
  {
    id: 'guide-tester',
    badge: 'HƯỚNG DẪN',
    thumbTitle: 'F8 CONNECT',
    title: 'Quy trình Dev không cài GTA V phối hợp cùng Tester',
    summary:
      'Dev chỉnh sửa backend, SQL và NUI trên máy làm việc; tester có GTA V kết nối vào port 30120 để kiểm tra thực tế và gửi log F8.',
    date: '17/11/2026',
    bg: 'linear-gradient(135deg, #0c4566 0%, #07142e 100%)',
    detail:
      'Khi chạy FXServer trên máy hoặc VPS, chỉ cần mở port 30120 TCP/UDP (hoặc dùng ZeroTier/Radmin VPN cho test nội bộ). Tester mở FiveM -> nhấn F8 -> gõ connect <IP>:30120 là có thể vào thẳng server.',
  },
  {
    id: 'jobs-system',
    badge: 'NGHỀ NGHIỆP',
    thumbTitle: '4 NGHỀ KHỞI TẠO',
    title: 'Cân bằng lương Thất nghiệp, Giao hàng, Thợ sửa xe & Cảnh sát',
    summary:
      'Hệ thống cấp bậc nghề nghiệp đi kèm mức lương tự động trả vào tài khoản ngân hàng mỗi 10 phút hoạt động.',
    date: '16/11/2026',
    bg: 'linear-gradient(135deg, #1b3b7a 0%, #081230 100%)',
    detail:
      'Admin có thể dùng lệnh /setjob <id> <ma_nghe> [cap_bac] trong game hoặc console txAdmin. Danh sách nghề hiện gồm: unemployed ($150), delivery ($450), mechanic ($700), police ($1,100).',
  },
  {
    id: 'onesync-48',
    badge: 'HẠ TẦNG',
    thumbTitle: 'ONESYNC 48 SLOT',
    title: 'Cấu hình OneSync miễn phí tối đa 48 người chơi qua Cfx.re Portal',
    summary:
      'Thiết lập sẵn server.cfg chuẩn OneSync, sẵn sàng nhập key miễn phí từ Cfx.re Portal để chạy thử cùng cộng đồng nhỏ.',
    date: '15/11/2026',
    bg: 'linear-gradient(135deg, #142a63 0%, #060d24 100%)',
    detail:
      'Bạn chỉ cần tạo License Key miễn phí tại Cfx.re Portal (https://portal.cfx.re/) và dán vào sv_licenseKey trong server-data/server.cfg. Khi nào cần trên 48 slot hoặc stream EUP mới cần đăng ký Element Club.',
  },
];

const MEDIA_ITEMS = [
  {
    id: 'media-1',
    title: 'Trình diễn giao diện NUI Ví tiền & HUD trong FiveM',
    desc: 'Xem trước trực tiếp giao diện bấm phím F5 trong game GTA V được thiết kế đồng bộ màu Midnight-Navy.',
    views: 'Preview Trực Tiếp',
    bg: 'linear-gradient(135deg, #0b3366, #07122e)',
    mode: 'nui',
  },
  {
    id: 'media-2',
    title: 'Kiến trúc kết nối MariaDB & txAdmin Recipe',
    desc: 'Sơ đồ bảng players, transactions trong database/schema.sql sẵn sàng nối với oxmysql.',
    views: 'Database SQL',
    bg: 'linear-gradient(135deg, #123678, #07112b)',
    mode: 'sql',
  },
  {
    id: 'media-3',
    title: 'Bộ lệnh Admin & Console để kiểm thử nhanh',
    desc: 'Danh sách lệnh /balance, /pay, /setjob, /addcash và /rphud dành cho Dev và Tester.',
    views: 'Tài liệu lệnh',
    bg: 'linear-gradient(135deg, #0d4559, #061229)',
    mode: 'commands',
  },
];

let activeSlideIndex = 0;
let activeMediaId = 'media-1';
let activeWalletPlayerId = '1';
let latestState = { profile: null, players: [], jobs: {} };

const els = {
  statOnline: document.getElementById('statOnline'),
  statJobs: document.getElementById('statJobs'),
  trailerCarousel: document.getElementById('trailerCarousel'),
  newsGrid: document.getElementById('newsGrid'),
  navSearchInput: document.getElementById('navSearchInput'),
  resetSearchBtn: document.getElementById('resetSearchBtn'),
  leaderboardList: document.getElementById('leaderboardList'),
  mediaPreviewBox: document.getElementById('mediaPreviewBox'),
  mediaList: document.getElementById('mediaList'),
  copyIpBtn: document.getElementById('copyIpBtn'),
  walletModal: document.getElementById('walletModal'),
  walletFeedback: document.getElementById('walletFeedback'),
  portalPlayerSelect: document.getElementById('portalPlayerSelect'),
  newPlayerNameInput: document.getElementById('newPlayerNameInput'),
  createPlayerBtn: document.getElementById('createPlayerBtn'),
  wPlayerName: document.getElementById('wPlayerName'),
  wPlayerId: document.getElementById('wPlayerId'),
  wJob: document.getElementById('wJob'),
  wSalary: document.getElementById('wSalary'),
  wCash: document.getElementById('wCash'),
  wBank: document.getElementById('wBank'),
  wTargetId: document.getElementById('wTargetId'),
  wAmount: document.getElementById('wAmount'),
  wNote: document.getElementById('wNote'),
  wTxList: document.getElementById('wTxList'),
  portalTransferForm: document.getElementById('portalTransferForm'),
  portalJobSelect: document.getElementById('portalJobSelect'),
  portalSetJobBtn: document.getElementById('portalSetJobBtn'),
  portalAddCashBtn: document.getElementById('portalAddCashBtn'),
  portalSalaryBtn: document.getElementById('portalSalaryBtn'),
  infoModal: document.getElementById('infoModal'),
  infoModalEyebrow: document.getElementById('infoModalEyebrow'),
  infoModalTitle: document.getElementById('infoModalTitle'),
  infoModalBody: document.getElementById('infoModalBody'),
  heroFivemPlayBtn: document.getElementById('heroFivemPlayBtn'),
  heroProtocolPreview: document.getElementById('heroProtocolPreview'),
  orbitServerBadge: document.getElementById('orbitServerBadge'),
  orbitTargetText: document.getElementById('orbitTargetText'),
  orbitFivemBtn: document.getElementById('orbitFivemBtn'),
  openServerConfigBtn: document.getElementById('openServerConfigBtn'),
  connectConfigPanel: document.getElementById('connectConfigPanel'),
  connectConfigFeedback: document.getElementById('connectConfigFeedback'),
  localhostWarningBox: document.getElementById('localhostWarningBox'),
  connectConfigForm: document.getElementById('connectConfigForm'),
  serverAddressInput: document.getElementById('serverAddressInput'),
  resetServerAddressBtn: document.getElementById('resetServerAddressBtn'),
  modalFivemLink: document.getElementById('modalFivemLink'),
  modalF8Cmd: document.getElementById('modalF8Cmd'),
};

const SERVER_OVERRIDE_KEY = 'rls5_server_override';

function getActiveConnectionInfo() {
  const baseCfg = Object.assign({}, window.RLS5_SERVER_CONFIG || {}, latestState.serverConfig || {});
  try {
    const saved = localStorage.getItem(SERVER_OVERRIDE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const result = window.buildServerConnectionInfo(parsed);
      if (result.ok) return result;
    }
  } catch {
    // Bỏ qua nếu localStorage bị tắt hoặc lỗi JSON
  }
  const fallback = window.buildServerConnectionInfo(baseCfg);
  if (fallback.ok) return fallback;
  return window.buildServerConnectionInfo({ address: '127.0.0.1:30120' });
}

function showConnectFeedback(ok, message) {
  if (!message) {
    els.connectConfigFeedback.classList.add('hidden');
    return;
  }
  els.connectConfigFeedback.textContent = message;
  els.connectConfigFeedback.className = `feedback ${ok ? 'ok' : 'error'}`;
}

function syncServerConnectionUI() {
  const info = getActiveConnectionInfo();

  els.heroFivemPlayBtn.href = info.launchHref;
  els.heroProtocolPreview.textContent = info.protocolLabel;

  els.orbitFivemBtn.href = info.launchHref;
  els.orbitTargetText.textContent = info.displayTarget;
  els.copyIpBtn.textContent = info.connectCmd;

  els.orbitServerBadge.classList.toggle('warn', info.isLocalhost);
  els.orbitServerBadge.innerHTML = '';
  const dot = document.createElement('i');
  dot.className = 'pulse-dot';
  els.orbitServerBadge.appendChild(dot);
  els.orbitServerBadge.appendChild(
    document.createTextNode(info.isLocalhost ? ' CHẾ ĐỘ LOCALHOST (CHỈ DEV)' : ' SẴN SÀNG CHO TESTER')
  );

  els.serverAddressInput.value = info.displayTarget;
  els.modalFivemLink.href = info.launchHref;
  els.modalFivemLink.textContent = info.protocolLabel;
  els.modalF8Cmd.textContent = info.connectCmd;
  els.localhostWarningBox.classList.toggle('hidden', !info.isLocalhost);
}

function formatMoney(amount) {
  return `$${Number(amount || 0).toLocaleString('en-US')}`;
}

let fallbackLoadPromise = null;

function loadFallbackClient(runtimeBase = './shared-runtime') {
  if (typeof window.handleStaticRpApiAsync === 'function') {
    return Promise.resolve();
  }
  if (!fallbackLoadPromise) {
    fallbackLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${runtimeBase}/browser-api-fallback.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Không thể tải static fallback runtime.'));
      document.head.appendChild(script);
    });
  }
  return fallbackLoadPromise;
}

async function apiRequest(path, body = null) {
  const cleanPath = String(path).replace(/^\/?api\//, '');
  const options = body
    ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    : { method: 'GET' };

  try {
    const resp = await fetch(`./api/${cleanPath}`, options);
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await resp.json();
    }
  } catch {
    // Chuyển sang chế độ static fallback khi không có backend Node.js (GitHub Pages)
  }

  await loadFallbackClient('./shared-runtime');
  return window.handleStaticRpApiAsync(cleanPath, body, './shared-runtime');
}

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function showWalletFeedback(ok, message) {
  if (!message) {
    els.walletFeedback.classList.add('hidden');
    return;
  }
  els.walletFeedback.textContent = message;
  els.walletFeedback.className = `feedback ${ok ? 'ok' : 'error'}`;
}

function renderTrailerCarousel() {
  els.trailerCarousel.innerHTML = '';
  const total = SHOWCASE_SLIDES.length;
  const order = [
    (activeSlideIndex + total - 1) % total,
    activeSlideIndex,
    (activeSlideIndex + 1) % total,
  ];

  order.forEach((slideIdx, pos) => {
    const slide = SHOWCASE_SLIDES[slideIdx];
    const card = document.createElement('article');
    card.className = `trailer-slide ${pos === 1 ? 'active' : ''}`;
    card.style.background = slide.bg;

    const visual = document.createElement('div');
    visual.className = 'trailer-visual';

    const tag = document.createElement('span');
    tag.className = 'trailer-tag';
    tag.textContent = slide.tag;

    const caption = document.createElement('div');
    caption.className = 'trailer-caption';

    const play = document.createElement('span');
    play.className = 'play-circle';
    play.textContent = '▶';

    const textWrap = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = slide.title;
    textWrap.appendChild(title);

    caption.appendChild(play);
    caption.appendChild(textWrap);
    visual.appendChild(tag);
    visual.appendChild(caption);
    card.appendChild(visual);

    card.addEventListener('click', () => {
      if (pos !== 1) {
        activeSlideIndex = slideIdx;
        renderTrailerCarousel();
      } else {
        openInfoModal('TÍNH NĂNG MÁY CHỦ', slide.title, [slide.subtitle]);
      }
    });

    els.trailerCarousel.appendChild(card);
  });
}

function renderNews(filterText = '') {
  const query = filterText.trim().toLowerCase();
  const filtered = NEWS_POSTS.filter(
    (p) =>
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.badge.toLowerCase().includes(query)
  );

  els.newsGrid.innerHTML = '';
  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Không tìm thấy bài viết phù hợp với từ khóa.';
    els.newsGrid.appendChild(empty);
    return;
  }

  for (const post of filtered) {
    const card = document.createElement('article');
    card.className = 'news-card';

    const thumb = document.createElement('div');
    thumb.className = 'news-thumb hud-frame';
    thumb.style.background = post.bg;

    const badge = document.createElement('span');
    badge.className = 'news-badge';
    badge.textContent = post.badge;

    const thumbTitle = document.createElement('span');
    thumbTitle.className = 'news-thumb-title';
    thumbTitle.textContent = post.thumbTitle;

    thumb.appendChild(badge);
    thumb.appendChild(thumbTitle);

    const body = document.createElement('div');
    body.className = 'news-body';

    const h3 = document.createElement('h3');
    h3.textContent = post.title;

    const p = document.createElement('p');
    p.textContent = post.summary;

    const footer = document.createElement('div');
    footer.className = 'news-footer';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'news-date';
    dateSpan.textContent = post.date;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'angled-btn';
    btn.textContent = 'Chi tiết ⊕';
    btn.addEventListener('click', () => {
      openInfoModal(post.badge, post.title, [post.summary, post.detail]);
    });

    footer.appendChild(dateSpan);
    footer.appendChild(btn);

    body.appendChild(h3);
    body.appendChild(p);
    body.appendChild(footer);

    card.appendChild(thumb);
    card.appendChild(body);
    els.newsGrid.appendChild(card);
  }
}

function renderMediaSection() {
  const activeItem = MEDIA_ITEMS.find((m) => m.id === activeMediaId) || MEDIA_ITEMS[0];

  els.mediaPreviewBox.innerHTML = '';
  const topTag = document.createElement('span');
  topTag.className = 'trailer-tag';
  topTag.textContent = activeItem.views;

  const heading = document.createElement('h3');
  heading.style.fontSize = '24px';
  heading.style.color = '#ffffff';
  heading.style.margin = '14px 0 8px';
  heading.textContent = activeItem.title;

  const desc = document.createElement('p');
  desc.style.color = '#b3c4e7';
  desc.style.marginBottom = '16px';
  desc.textContent = activeItem.desc;

  const bodyBox = document.createElement('div');
  bodyBox.style.flex = '1';
  bodyBox.style.display = 'flex';
  bodyBox.style.flexDirection = 'column';
  bodyBox.style.justifyContent = 'center';

  if (activeItem.mode === 'nui') {
    const frame = document.createElement('iframe');
    frame.src = './nui/';
    frame.title = 'FiveM NUI Preview';
    frame.style.width = '100%';
    frame.style.height = '260px';
    frame.style.border = '1px solid rgba(126, 243, 255, 0.35)';
    frame.style.borderRadius = '8px';
    bodyBox.appendChild(frame);
  } else if (activeItem.mode === 'sql') {
    const pre = document.createElement('pre');
    pre.style.background = '#04091a';
    pre.style.padding = '14px';
    pre.style.border = '1px solid rgba(126, 243, 255, 0.25)';
    pre.style.color = '#7ef3ff';
    pre.style.overflowX = 'auto';
    pre.textContent =
      'CREATE TABLE players (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  identifier VARCHAR(80) UNIQUE,\n  name VARCHAR(80),\n  cash BIGINT DEFAULT 2500,\n  bank BIGINT DEFAULT 15000,\n  job VARCHAR(40) DEFAULT "unemployed"\n);';
    bodyBox.appendChild(pre);
  } else {
    const pre = document.createElement('pre');
    pre.style.background = '#04091a';
    pre.style.padding = '14px';
    pre.style.border = '1px solid rgba(126, 243, 255, 0.25)';
    pre.style.color = '#7ef3ff';
    pre.style.overflowX = 'auto';
    pre.textContent =
      'F5 hoặc /rphud      -> Mở bảng Ví & Nghề nghiệp\n/balance            -> Xem nhanh tiền mặt & ngân hàng\n/pay <id> <tiền>    -> Chuyển khoản cho người chơi\n/setjob <id> <nghề> -> Đổi nghề (Admin/Console)\n/addcash <id> <tiền>-> Cộng tiền mặt test (Admin)';
    bodyBox.appendChild(pre);
  }

  els.mediaPreviewBox.appendChild(topTag);
  els.mediaPreviewBox.appendChild(heading);
  els.mediaPreviewBox.appendChild(desc);
  els.mediaPreviewBox.appendChild(bodyBox);

  els.mediaList.innerHTML = '';
  for (const item of MEDIA_ITEMS) {
    const card = document.createElement('article');
    card.className = `media-item hud-frame-subtle ${item.id === activeMediaId ? 'active' : ''}`;

    const thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    thumb.style.background = item.bg;

    const play = document.createElement('span');
    play.className = 'play-circle';
    play.textContent = '▶';
    thumb.appendChild(play);

    const info = document.createElement('div');
    info.className = 'media-info';

    const h4 = document.createElement('h4');
    h4.textContent = item.title;

    const p = document.createElement('p');
    p.textContent = item.desc;

    const views = document.createElement('span');
    views.className = 'media-views';
    views.textContent = `● ${item.views}`;

    info.appendChild(h4);
    info.appendChild(p);
    info.appendChild(views);

    card.appendChild(thumb);
    card.appendChild(info);

    card.addEventListener('click', () => {
      activeMediaId = item.id;
      renderMediaSection();
    });

    els.mediaList.appendChild(card);
  }
}

function renderLeaderboard(players) {
  const sorted = [...players].sort((a, b) => b.cash + b.bank - (a.cash + a.bank));
  els.leaderboardList.innerHTML = '';

  sorted.slice(0, 5).forEach((p, idx) => {
    const li = document.createElement('li');
    li.className = 'leader-item';

    const left = document.createElement('div');
    left.className = 'leader-left';

    const rank = document.createElement('span');
    rank.className = 'leader-rank';
    rank.textContent = `#${idx + 1}`;

    const info = document.createElement('div');
    const nameEl = document.createElement('div');
    nameEl.className = 'leader-name';
    nameEl.textContent = `${p.name} (ID ${p.id})`;

    const jobEl = document.createElement('div');
    jobEl.className = 'leader-job';
    jobEl.textContent = `${p.jobLabel} • ${p.jobGradeLabel}`;

    info.appendChild(nameEl);
    info.appendChild(jobEl);
    left.appendChild(rank);
    left.appendChild(info);

    const money = document.createElement('span');
    money.className = 'leader-money';
    money.textContent = formatMoney(p.cash + p.bank);

    li.appendChild(left);
    li.appendChild(money);
    els.leaderboardList.appendChild(li);
  });
}

function renderWalletModal() {
  const { profile, players, jobs } = latestState;
  if (!profile) return;

  els.portalPlayerSelect.innerHTML = '';
  for (const p of players) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `#${p.id} - ${p.name}`;
    opt.selected = p.id === profile.id;
    els.portalPlayerSelect.appendChild(opt);
  }

  els.portalJobSelect.innerHTML = '';
  for (const [jobId, def] of Object.entries(jobs)) {
    const opt = document.createElement('option');
    opt.value = jobId;
    opt.textContent = `${def.label} (${formatMoney(def.salary)})`;
    opt.selected = jobId === profile.job;
    els.portalJobSelect.appendChild(opt);
  }

  els.wPlayerName.textContent = profile.name;
  els.wPlayerId.textContent = `Server ID: #${profile.id}`;
  els.wJob.textContent = `${profile.jobLabel} (${profile.jobGradeLabel})`;
  els.wSalary.textContent = `Lương: ${formatMoney(profile.salary)} / chu kỳ`;
  els.wCash.textContent = formatMoney(profile.cash);
  els.wBank.textContent = formatMoney(profile.bank);

  const otherPlayer = players.find((p) => p.id !== profile.id);
  if (!els.wTargetId.value && otherPlayer) {
    els.wTargetId.value = otherPlayer.id;
  }

  els.wTxList.innerHTML = '';
  if (!profile.transactions.length) {
    const li = document.createElement('li');
    li.className = 'tx-empty';
    li.textContent = 'Chưa có giao dịch nào.';
    els.wTxList.appendChild(li);
    return;
  }

  for (const tx of profile.transactions) {
    const li = document.createElement('li');
    li.className = 'tx-item';

    const left = document.createElement('div');
    const title = document.createElement('div');
    title.textContent = tx.note || tx.type;
    const sub = document.createElement('small');
    sub.style.color = '#8fa4ce';
    sub.textContent = `${tx.account.toUpperCase()} • ${new Date(tx.timestamp).toLocaleTimeString('vi-VN')}`;
    left.appendChild(title);
    left.appendChild(sub);

    const isOut = tx.type === 'transfer_out' || tx.type === 'debit';
    const amount = document.createElement('span');
    amount.className = isOut ? 'tx-minus' : 'tx-plus';
    amount.textContent = `${isOut ? '-' : '+'}${formatMoney(tx.amount)}`;

    li.appendChild(left);
    li.appendChild(amount);
    els.wTxList.appendChild(li);
  }
}

async function refreshServerState() {
  const data = await apiRequest(`/api/state?playerId=${encodeURIComponent(activeWalletPlayerId)}`);
  latestState = data;
  if (data.profile) {
    activeWalletPlayerId = data.profile.id;
  }
  els.statOnline.textContent = String(data.players.length);
  els.statJobs.textContent = String(Object.keys(data.jobs).length);
  renderLeaderboard(data.players);
  renderWalletModal();
  syncServerConnectionUI();
}

function openInfoModal(eyebrow, title, paragraphs, codeBlock = '', showConnectConfig = false) {
  els.infoModalEyebrow.textContent = eyebrow;
  els.infoModalTitle.textContent = title;
  els.infoModalBody.innerHTML = '';
  for (const text of paragraphs) {
    const p = document.createElement('p');
    p.textContent = text;
    els.infoModalBody.appendChild(p);
  }
  if (codeBlock) {
    const pre = document.createElement('pre');
    pre.textContent = codeBlock;
    els.infoModalBody.appendChild(pre);
  }
  els.connectConfigPanel.classList.toggle('hidden', !showConnectConfig);
  if (showConnectConfig) {
    showConnectFeedback(true, '');
    syncServerConnectionUI();
  }
  openModal('infoModal');
}

function openGuideModal() {
  const info = getActiveConnectionInfo();
  openInfoModal(
    'KẾT NỐI TESTER • RLS5',
    'Kết nối & Cấu hình IP / Tên miền Server FiveM',
    [
      '1. Bật FXServer (server-data/server.cfg) kèm key miễn phí từ Cfx.re Portal và mở port 30120 TCP/UDP (hoặc ZeroTier/Radmin VPN).',
      '2. Tester có GTA V chỉ cần bấm nút "MỞ FIVEM VÀO NGAY" trên web, hoặc mở FiveM → nhấn F8 → dán lệnh bên dưới:',
      '3. Khi vào thành phố, nhấn F5 (hoặc /rphud) để mở Ví & Nghề nghiệp RLS5.',
    ],
    info.connectCmd,
    true
  );
}

// Event bindings
document.querySelectorAll('[data-close-modal]').forEach((btn) => {
  btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
});

[els.walletModal, els.infoModal].forEach((backdrop) => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.classList.add('hidden');
  });
});

['openWalletNavBtn', 'heroWalletBtn', 'openWalletSidebarBtn'].forEach((id) => {
  document.getElementById(id).addEventListener('click', () => openModal('walletModal'));
});

['openGuideTop', 'openGuideNavBtn', 'heroConnectBtn', 'openGuideSidebarBtn', 'openServerConfigBtn'].forEach((id) => {
  document.getElementById(id).addEventListener('click', openGuideModal);
});

els.connectConfigForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const parsed = window.buildServerConnectionInfo({ address: els.serverAddressInput.value });
  if (!parsed.ok) {
    showConnectFeedback(false, parsed.error);
    return;
  }
  const toSave =
    parsed.mode === 'cfx'
      ? { cfxJoinCode: parsed.cfxJoinCode }
      : { address: parsed.address };
  try {
    localStorage.setItem(SERVER_OVERRIDE_KEY, JSON.stringify(toSave));
  } catch {
    // Vẫn cập nhật UI trong phiên hiện tại nếu localStorage bị chặn
  }
  syncServerConnectionUI();
  const pre = els.infoModalBody.querySelector('pre');
  if (pre) pre.textContent = parsed.connectCmd;
  showConnectFeedback(true, `Đã cập nhật link kết nối: ${parsed.protocolLabel}`);
});

els.resetServerAddressBtn.addEventListener('click', () => {
  try {
    localStorage.removeItem(SERVER_OVERRIDE_KEY);
  } catch {
    // Ignore
  }
  syncServerConnectionUI();
  const info = getActiveConnectionInfo();
  const pre = els.infoModalBody.querySelector('pre');
  if (pre) pre.textContent = info.connectCmd;
  showConnectFeedback(true, `Đã khôi phục cấu hình mặc định: ${info.displayTarget}`);
});

els.copyIpBtn.addEventListener('click', async () => {
  const info = getActiveConnectionInfo();
  const cmd = info.connectCmd;
  try {
    await navigator.clipboard.writeText(cmd);
    els.copyIpBtn.textContent = 'Đã copy: ' + cmd;
    setTimeout(() => {
      syncServerConnectionUI();
    }, 1800);
  } catch {
    openGuideModal();
  }
});

els.navSearchInput.addEventListener('input', (e) => {
  renderNews(e.target.value);
});

els.resetSearchBtn.addEventListener('click', () => {
  els.navSearchInput.value = '';
  renderNews('');
});

els.portalPlayerSelect.addEventListener('change', async () => {
  activeWalletPlayerId = els.portalPlayerSelect.value;
  const other = latestState.players.find((p) => p.id !== activeWalletPlayerId);
  els.wTargetId.value = other ? other.id : '';
  await refreshServerState();
  showWalletFeedback(true, `Đang xem hồ sơ công dân #${activeWalletPlayerId}.`);
});

els.createPlayerBtn.addEventListener('click', async () => {
  const name = els.newPlayerNameInput.value.trim();
  const res = await apiRequest('/api/players', { name });
  if (res.ok) {
    activeWalletPlayerId = res.profile.id;
    els.newPlayerNameInput.value = '';
    await refreshServerState();
    showWalletFeedback(true, `Đã tạo công dân mới #${res.profile.id} (${res.profile.name}).`);
  } else {
    showWalletFeedback(false, res.error);
  }
});

els.portalTransferForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await apiRequest('/api/transfer', {
    senderId: activeWalletPlayerId,
    targetId: els.wTargetId.value.trim(),
    amount: Number(els.wAmount.value),
    note: els.wNote.value.trim(),
  });
  await refreshServerState();
  if (res.ok) {
    els.wAmount.value = '';
    els.wNote.value = '';
    showWalletFeedback(true, 'Chuyển khoản thành công!');
  } else {
    showWalletFeedback(false, res.error);
  }
});

els.portalSetJobBtn.addEventListener('click', async () => {
  const res = await apiRequest('/api/setjob', {
    playerId: activeWalletPlayerId,
    jobId: els.portalJobSelect.value,
  });
  await refreshServerState();
  showWalletFeedback(res.ok, res.ok ? `Đã đổi nghề thành ${res.profile.jobLabel}.` : res.error);
});

els.portalAddCashBtn.addEventListener('click', async () => {
  const res = await apiRequest('/api/addcash', {
    playerId: activeWalletPlayerId,
    amount: 1000,
  });
  await refreshServerState();
  showWalletFeedback(res.ok, res.ok ? 'Đã cộng +$1,000 tiền mặt test.' : res.error);
});

els.portalSalaryBtn.addEventListener('click', async () => {
  const res = await apiRequest('/api/salary', {});
  await refreshServerState();
  showWalletFeedback(true, `Đã phát lương cho ${res.payoutCount} công dân online.`);
});

// Initial render
syncServerConnectionUI();
renderTrailerCarousel();
renderNews();
renderMediaSection();
refreshServerState();
