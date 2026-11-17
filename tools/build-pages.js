/**
 * Build static GitHub Pages bundle into ./dist/ without duplicating source code.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PORTAL_DIR = path.join(ROOT_DIR, 'portal-web');
const NUI_DIR = path.join(ROOT_DIR, 'server-data/resources/[local]/rp-core/web');
const RP_CORE_DIR = path.join(ROOT_DIR, 'server-data/resources/[local]/rp-core');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function buildPages(targetDir = DIST_DIR) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  copyRecursive(PORTAL_DIR, targetDir);
  copyRecursive(NUI_DIR, path.join(targetDir, 'nui'));

  const sharedDest = path.join(targetDir, 'shared-runtime');
  fs.mkdirSync(sharedDest, { recursive: true });
  fs.copyFileSync(path.join(RP_CORE_DIR, 'shared/config.js'), path.join(sharedDest, 'config.js'));
  fs.copyFileSync(path.join(RP_CORE_DIR, 'server/economy.js'), path.join(sharedDest, 'economy.js'));
  fs.copyFileSync(
    path.join(ROOT_DIR, 'tools/browser-api-fallback.js'),
    path.join(sharedDest, 'browser-api-fallback.js')
  );

  // Prevent GitHub Pages Jekyll from ignoring files/directories
  fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');
  return targetDir;
}

if (require.main === module) {
  const outDir = buildPages();
  console.log(`[build-pages] Static GitHub Pages bundle generated at: ${outDir}`);
}

module.exports = { buildPages };
