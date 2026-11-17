const test = require('node:test');
const assert = require('node:assert/strict');

const {
  RLS5_SERVER_CONFIG,
  buildServerConnectionInfo,
} = require('../portal-web/server-config.js');

test('validates exported RLS5_SERVER_CONFIG cleanly', () => {
  const info = buildServerConnectionInfo(RLS5_SERVER_CONFIG);
  assert.equal(info.ok, true);
  assert.ok(info.launchHref.startsWith('fivem://connect/') || info.launchHref.startsWith('https://cfx.re/join/'));
});

test('marks localhost connection info as isLocalhost true', () => {
  const info = buildServerConnectionInfo({ address: '127.0.0.1:30120' });
  assert.equal(info.ok, true);
  assert.equal(info.mode, 'direct');
  assert.equal(info.address, '127.0.0.1:30120');
  assert.equal(info.launchHref, 'fivem://connect/127.0.0.1:30120');
  assert.equal(info.connectCmd, 'connect 127.0.0.1:30120');
  assert.equal(info.isLocalhost, true);
});

test('appends default 30120 port for domain or VPN IP and marks isLocalhost false', () => {
  const domainInfo = buildServerConnectionInfo({ address: 'play.rls5.vn' });
  assert.equal(domainInfo.ok, true);
  assert.equal(domainInfo.address, 'play.rls5.vn:30120');
  assert.equal(domainInfo.launchHref, 'fivem://connect/play.rls5.vn:30120');
  assert.equal(domainInfo.isLocalhost, false);

  const stripped = buildServerConnectionInfo({ address: 'fivem://connect/26.15.88.10:30121/' });
  assert.equal(stripped.ok, true);
  assert.equal(stripped.address, '26.15.88.10:30121');
  assert.equal(stripped.connectCmd, 'connect 26.15.88.10:30121');
});

test('supports cfx.re/join codes cleanly', () => {
  const byCode = buildServerConnectionInfo({ cfxJoinCode: 'rls5vn' });
  assert.equal(byCode.ok, true);
  assert.equal(byCode.mode, 'cfx');
  assert.equal(byCode.launchHref, 'https://cfx.re/join/rls5vn');
  assert.equal(byCode.connectCmd, 'connect cfx.re/join/rls5vn');

  const byUrl = buildServerConnectionInfo({ address: 'https://cfx.re/join/abc999' });
  assert.equal(byUrl.ok, true);
  assert.equal(byUrl.cfxJoinCode, 'abc999');
});

test('rejects invalid hosts, ports, and unsafe schemes', () => {
  assert.equal(buildServerConnectionInfo({ address: 'javascript:alert(1)' }).ok, false);
  assert.equal(buildServerConnectionInfo({ address: 'play.rls5.vn:99999' }).ok, false);
  assert.equal(buildServerConnectionInfo({ cfxJoinCode: 'bad code!' }).ok, false);
});
