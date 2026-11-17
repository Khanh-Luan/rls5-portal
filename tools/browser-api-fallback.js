/**
 * Trình mô phỏng API ngay trên trình duyệt bằng chính RpConfig + RpEconomyStore thật
 * khi web được host tĩnh (ví dụ GitHub Pages / Cloudflare Pages) không có Node.js backend.
 */
(function initBrowserFallback(global) {
  const STORAGE_KEY = 'rls5_static_economy_v1';

  function loadStore() {
    const store = new global.RpEconomyStore({ config: global.RpConfig });
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.players) && parsed.players.length > 0) {
          for (const p of parsed.players) {
            store.players.set(String(p.id), p);
          }
          store.nextTxId = Number(parsed.nextTxId) || 1;
          return { store, nextGeneratedId: Number(parsed.nextGeneratedId) || 3 };
        }
      }
    } catch {
      // Bỏ qua nếu localStorage không đọc được
    }

    store.ensurePlayer('1', 'Minh Anh (Dev)');
    store.ensurePlayer('2', 'Hoàng Nam (Tester)');
    store.setJob('2', 'mechanic', 1);
    return { store, nextGeneratedId: 3 };
  }

  function saveStore(state) {
    try {
      const serialized = {
        players: Array.from(state.store.players.values()),
        nextTxId: state.store.nextTxId,
        nextGeneratedId: state.nextGeneratedId,
      };
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch {
      // Ignore storage quota errors
    }
  }

  let runtime = null;

  function ensureRuntime() {
    if (!runtime) {
      runtime = loadStore();
      saveStore(runtime);
    }
    return runtime;
  }

  global.handleStaticRpApi = function handleStaticRpApi(endpointPath, body = null) {
    const state = ensureRuntime();
    const { store } = state;

    if (endpointPath.startsWith('state')) {
      const queryIndex = endpointPath.indexOf('?');
      const params = new URLSearchParams(queryIndex >= 0 ? endpointPath.slice(queryIndex) : '');
      const playerId = params.get('playerId') || '1';
      const profile = store.getProfile(playerId) || store.getProfile('1');
      return {
        ok: true,
        staticMode: true,
        profile,
        players: store.listPlayers(),
        jobs: global.RpConfig.jobs,
      };
    }

    let result = { ok: false, error: 'Unsupported endpoint' };

    if (endpointPath === 'players') {
      const id = String(state.nextGeneratedId++);
      const name = body && typeof body.name === 'string' && body.name.trim()
        ? body.name.trim()
        : `Công dân #${id}`;
      const profile = store.ensurePlayer(id, name);
      result = { ok: true, profile };
    } else if (endpointPath === 'transfer') {
      result = store.transferBank(body.senderId, body.targetId, body.amount, body.note);
    } else if (endpointPath === 'setjob') {
      result = store.setJob(body.playerId, body.jobId, body.grade || 0);
    } else if (endpointPath === 'addcash') {
      result = store.addMoney(body.playerId, 'cash', body.amount, 'Web demo +cash');
    } else if (endpointPath === 'salary') {
      const payouts = store.paySalaries();
      result = { ok: true, payoutCount: payouts.length };
    }

    saveStore(state);
    return result;
  };

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-runtime-src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === '1') return resolve();
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.dataset.runtimeSrc = src;
      script.onload = () => {
        script.dataset.loaded = '1';
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  let depsPromise = null;

  global.handleStaticRpApiAsync = async function handleStaticRpApiAsync(
    endpointPath,
    body = null,
    runtimeBase = './shared-runtime'
  ) {
    if (!global.RpConfig || !global.RpEconomyStore) {
      if (!depsPromise) {
        depsPromise = loadScriptOnce(`${runtimeBase}/config.js`).then(() =>
          loadScriptOnce(`${runtimeBase}/economy.js`)
        );
      }
      await depsPromise;
    }
    return global.handleStaticRpApi(endpointPath, body);
  };
})(window);
