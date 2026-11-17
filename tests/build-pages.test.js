const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildPages } = require('../tools/build-pages.js');

test('builds complete GitHub Pages bundle with portal, nui, shared runtime, and .nojekyll', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rls5-pages-'));
  try {
    buildPages(tmpDir);

    const requiredFiles = [
      'index.html',
      'style.css',
      'app.js',
      'server-config.js',
      'assets/rls5-logo.png',
      'nui/index.html',
      'nui/style.css',
      'nui/app.js',
      'nui/rls5-logo.png',
      'shared-runtime/config.js',
      'shared-runtime/economy.js',
      'shared-runtime/browser-api-fallback.js',
      '.nojekyll',
    ];

    for (const rel of requiredFiles) {
      assert.equal(fs.existsSync(path.join(tmpDir, rel)), true, `Missing ${rel}`);
    }

    const portalHtml = fs.readFileSync(path.join(tmpDir, 'index.html'), 'utf8');
    assert.equal(portalHtml.includes('href="/style.css"'), false);
    assert.equal(portalHtml.includes('src="/app.js"'), false);
    assert.equal(portalHtml.includes('href="./style.css"'), true);
    assert.equal(portalHtml.includes('src="./app.js"'), true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
