/**
 * Cấu hình kết nối Server FiveM cho cổng web RLS5 (Royal Los Santos 5).
 * Khi đưa lên VPS hoặc hosting thật, bạn chỉ cần sửa `address` (hoặc `cfxJoinCode`) tại đây.
 */
const RLS5_SERVER_CONFIG = {
  serverName: 'RLS5 • Royal Los Santos 5',
  // Thay bằng IP ZeroTier/Radmin VPN, IP VPS hoặc tên miền game (vd: 'play.rls5.vn:30120')
  address: 'rls5.net',
  // Nếu dùng link cfx.re/join/xxxxxx thì điền mã phía sau (vd: 'abc123'), để trống nếu dùng IP/Domain
  cfxJoinCode: '',
};

/**
 * Chuẩn hóa & kiểm tra an toàn địa chỉ kết nối FiveM (chống injection giao thức lạ).
 */
function buildServerConnectionInfo(rawInput = {}) {
  const rawCode = String(rawInput.cfxJoinCode || '')
    .trim()
    .replace(/^https?:\/\/cfx\.re\/join\//i, '')
    .replace(/^fivem:\/\/connect\/cfx\.re\/join\//i, '')
    .replace(/^connect\s+cfx\.re\/join\//i, '')
    .replace(/\/+$/, '');

  if (rawCode) {
    if (!/^[a-zA-Z0-9]{4,16}$/.test(rawCode)) {
      return { ok: false, error: 'Mã cfx.re/join chỉ gồm 4–16 ký tự chữ và số.' };
    }
    return {
      ok: true,
      mode: 'cfx',
      cfxJoinCode: rawCode,
      displayTarget: `cfx.re/join/${rawCode}`,
      connectCmd: `connect cfx.re/join/${rawCode}`,
      launchHref: `https://cfx.re/join/${rawCode}`,
      protocolLabel: `https://cfx.re/join/${rawCode}`,
      isLocalhost: false,
    };
  }

  let cleaned = String(rawInput.address || RLS5_SERVER_CONFIG.address)
    .trim()
    .replace(/^fivem:\/\/connect\//i, '')
    .replace(/^connect\s+/i, '')
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '');

  // Hỗ trợ nếu người dùng dán nguyên link cfx.re/join/... vào ô address
  const cfxMatch = cleaned.match(/^cfx\.re\/join\/([a-zA-Z0-9]{4,16})$/i);
  if (cfxMatch) {
    return buildServerConnectionInfo({ cfxJoinCode: cfxMatch[1] });
  }

  if (!cleaned) {
    return { ok: false, error: 'Vui lòng nhập IP, tên miền hoặc mã cfx.re/join.' };
  }

  const parts = cleaned.split(':');
  if (parts.length > 2) {
    return { ok: false, error: 'Địa chỉ IP/tên miền không hợp lệ.' };
  }

  const host = parts[0].trim();
  const portStr = parts[1] !== undefined ? parts[1].trim() : '30120';

  if (!/^[a-zA-Z0-9.-]+$/.test(host) || host.startsWith('.') || host.endsWith('.')) {
    return { ok: false, error: 'Tên miền hoặc IP chứa ký tự không hợp lệ.' };
  }

  const port = Number(portStr);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { ok: false, error: 'Port phải nằm trong khoảng 1–65535 (mặc định FiveM là 30120).' };
  }

  const normalizedAddress = `${host}:${port}`;
  const lowerHost = host.toLowerCase();
  const isLocalhost = lowerHost === '127.0.0.1' || lowerHost === 'localhost' || lowerHost === '0.0.0.0';

  return {
    ok: true,
    mode: 'direct',
    address: normalizedAddress,
    cfxJoinCode: '',
    displayTarget: normalizedAddress,
    connectCmd: `connect ${normalizedAddress}`,
    launchHref: `fivem://connect/${normalizedAddress}`,
    protocolLabel: `fivem://connect/${normalizedAddress}`,
    isLocalhost,
  };
}

if (typeof window !== 'undefined') {
  window.RLS5_SERVER_CONFIG = RLS5_SERVER_CONFIG;
  window.buildServerConnectionInfo = buildServerConnectionInfo;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RLS5_SERVER_CONFIG, buildServerConnectionInfo };
}
