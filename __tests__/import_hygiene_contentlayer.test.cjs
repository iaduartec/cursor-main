/**
 * Verifica que no existan imports directos a 'contentlayer/generated' fuera de los archivos permitidos.
 * Permitidos: next.config.mjs (config webpack), cualquier archivo dentro de .contentlayer, y el stub vacío.
 */
const fs = require('fs');
const path = require('path');
const { test } = require('node:test');

const ROOT = process.cwd();
const ALLOWED_FILES = new Set([
  path.join(ROOT, 'next.config.mjs').replace(/\\/g, '/'),
  path.join(ROOT, 'lib', 'contentlayer-empty.mjs').replace(/\\/g, '/'),
  path.join(ROOT, 'lib', 'contentlayer-wrapper.ts').replace(/\\/g, '/'),
]);

function collectFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules') continue;
    if (e.name.startsWith('.git')) continue;
    if (e.name === '.contentlayer') continue; // generado
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collectFiles(full));
    else out.push(full);
  }
  return out;
}

test('Import hygiene: sin referencias directas a contentlayer/generated', () => {
  const scanRoots = ['lib', 'app', 'components', 'scripts']
    .map(d => path.join(ROOT, d))
    .filter(fs.existsSync);
  const files = scanRoots.flatMap(r => collectFiles(r));
  const offenders = [];
  for (const f of files) {
    const norm = f.replace(/\\/g, '/');
    if (ALLOWED_FILES.has(norm)) continue;
    // Permitir prototipos *.new.ts mientras estén fuera de uso
    if (/\.new\.ts$/.test(norm)) continue;
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('contentlayer/generated')) {
      offenders.push(norm);
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      'Encontradas referencias directas prohibidas a contentlayer/generated en:\n' +
        offenders.join('\n')
    );
  }
});
