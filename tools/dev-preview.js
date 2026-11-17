/**
 * Local Browser Dev Preview Server for FiveM RP-Core.
 * Serves:
 *   - "/"      -> GTA5VN-styled Server Community Portal (portal-web/)
 *   - "/nui"   -> In-game FiveM NUI HUD & Wallet (server-data/resources/[local]/rp-core/web/)
 *   - "/api/*" -> Live EconomyStore endpoints shared directly with FXServer logic
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const config = require('../server-data/resources/[local]/rp-core/shared/config.js');
const { EconomyStore } = require('../server-data/resources/[local]/rp-core/server/economy.js');

const PORTAL_DIR = path.resolve(__dirname, '../portal-web');
const NUI_DIR = path.resolve(__dirname, '../server-data/resources/[local]/rp-core/web');
const RP_CORE_DIR = path.resolve(__dirname, '../server-data/resources/[local]/rp-core');
const PORT = Number(process.env.PORT || 3000);

const SHARED_RUNTIME_FILES = {
  'config.js': path.join(RP_CORE_DIR, 'shared/config.js'),
  'economy.js': path.join(RP_CORE_DIR, 'server/economy.js'),
  'browser-api-fallback.js': path.resolve(__dirname, 'browser-api-fallback.js'),
};

const store = new EconomyStore({ config });
store.ensurePlayer('1', 'Minh Anh (Dev)');
store.ensurePlayer('2', 'Hoàng Nam (Tester)');
store.setJob('2', 'mechanic', 1);
let nextGeneratedId = 3;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function serveStaticFile(res, baseDir, relPath) {
  const cleanRel = relPath === '' || relPath === '/' ? 'index.html' : relPath.replace(/^\/+/, '');
  const fullPath = path.resolve(baseDir, path.normalize(cleanRel));

  if (!fullPath.startsWith(baseDir + path.sep) && fullPath !== path.join(baseDir, 'index.html')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function getEnvServerConfig() {
  const address = (process.env.FIVEM_SERVER_ADDRESS || '').trim();
  const cfxJoinCode = (process.env.FIVEM_CFX_CODE || '').trim();
  if (!address && !cfxJoinCode) return null;
  return {
    ...(address ? { address } : {}),
    ...(cfxJoinCode ? { cfxJoinCode } : {}),
  };
}

function handleApi(req, res, urlObj) {
  if (req.method === 'GET' && urlObj.pathname === '/api/state') {
    const playerId = urlObj.searchParams.get('playerId') || '1';
    const profile = store.getProfile(playerId) || store.getProfile('1');
    return sendJson(res, 200, {
      ok: true,
      profile,
      players: store.listPlayers(),
      jobs: config.jobs,
      serverConfig: getEnvServerConfig(),
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
  }

  return readJsonBody(req)
    .then((body) => {
      if (urlObj.pathname === '/api/players') {
        const id = String(nextGeneratedId++);
        const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : `Công dân #${id}`;
        const profile = store.ensurePlayer(id, name);
        return sendJson(res, 201, { ok: true, profile });
      }
      if (urlObj.pathname === '/api/transfer') {
        const result = store.transferBank(body.senderId, body.targetId, body.amount, body.note);
        return sendJson(res, result.ok ? 200 : 400, result);
      }
      if (urlObj.pathname === '/api/setjob') {
        const result = store.setJob(body.playerId, body.jobId, body.grade || 0);
        return sendJson(res, result.ok ? 200 : 400, result);
      }
      if (urlObj.pathname === '/api/addcash') {
        const result = store.addMoney(body.playerId, 'cash', body.amount, 'Web preview +cash');
        return sendJson(res, result.ok ? 200 : 400, result);
      }
      if (urlObj.pathname === '/api/salary') {
        const payouts = store.paySalaries();
        return sendJson(res, 200, { ok: true, payoutCount: payouts.length });
      }
      return sendJson(res, 404, { ok: false, error: 'Unknown endpoint' });
    })
    .catch((err) => sendJson(res, 400, { ok: false, error: err.message }));
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (urlObj.pathname.startsWith('/api/')) {
    return handleApi(req, res, urlObj);
  }

  if (urlObj.pathname === '/nui') {
    res.writeHead(302, { Location: '/nui/' });
    return res.end();
  }

  if (urlObj.pathname.startsWith('/nui/')) {
    const subPath = urlObj.pathname.slice('/nui'.length);
    return serveStaticFile(res, NUI_DIR, subPath);
  }

  if (urlObj.pathname.startsWith('/shared-runtime/')) {
    const fileName = urlObj.pathname.slice('/shared-runtime/'.length);
    const targetFile = SHARED_RUNTIME_FILES[fileName];
    if (!targetFile) {
      res.writeHead(404);
      return res.end('Not found');
    }
    return fs.readFile(targetFile, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not found');
      }
      res.writeHead(200, { 'Content-Type': MIME_TYPES['.js'] });
      res.end(content);
    });
  }

  return serveStaticFile(res, PORTAL_DIR, urlObj.pathname);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[rp-core preview] Server Portal (GTA5VN style): http://127.0.0.1:${PORT}/`);
  console.log(`[rp-core preview] In-Game NUI HUD Preview:       http://127.0.0.1:${PORT}/nui`);
  console.log('[rp-core preview] Press Ctrl+C to stop.');
});
