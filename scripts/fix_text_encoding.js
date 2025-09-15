const fs = require('fs');
const path = require('path');

function findFiles(dir, ext = '.mdx') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {out.push(...findFiles(full, ext));}
    else if (stat.isFile() && full.endsWith(ext)) {out.push(full);}
  }
  return out;
}

const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');

if (!fs.existsSync(contentDir)) {
  console.log('[fix_text_encoding] No existe carpeta content/. Saltando.');
  process.exit(0);
}

const files = findFiles(contentDir, '.mdx');
let changed = 0;
for (const file of files) {
  let raw = fs.readFileSync(file);
  // Remove BOM if present
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
    raw = raw.slice(3);
  }
  let s = raw.toString('utf8');
  const original = s;
  // Normalize line endings to LF
  s = s.replace(/\r\n/g, '\n');
  // Trim trailing spaces on lines
  s = s.split('\n').map(l => l.replace(/[ \t]+$/,'' )).join('\n');
  if (s !== original) {
    fs.writeFileSync(file, s, 'utf8');
    changed++;
    console.log(`[fix_text_encoding] Normalizado: ${file}`);
  }
}

console.log(`[fix_text_encoding] Hecho. Archivos modificados: ${changed}`);
