#!/usr/bin/env node
// Fix Spanish mojibake across the repo using safe Unicode escapes.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'components', 'content', 'scripts'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.jsx', '.json', '.md', '.mdx', '.css', '.yml', '.yaml']);

// Rare stray characters mapped to proper accents
const charMap = new Map([
  ['\u01ED', '\u00E1'], // á -> á
  ['\u01F8', '\u00E9'], // é -> é
  ['\u01E7', '\u00FA'], // ú -> ú
]);

// Common UTF-8 double-decoding artifacts (e.g., á -> á)
const utf8Pairs = new Map([
  ['\u00C3\u00A1', '\u00E1'], // á -> á
  ['\u00C3\u00A9', '\u00E9'], // é -> é
  ['\u00C3\u00AD', '\u00ED'], // í -> í
  ['\u00C3\u00B3', '\u00F3'], // ó -> ó
  ['\u00C3\u00BA', '\u00FA'], // ú -> ú
  ['\u00C3\u00B1', '\u00F1'], // ñ -> ñ
  ['\u00C3\u0081', '\u00C1'], // Ã� -> Á
  ['\u00C3\u0089', '\u00C9'], // Ã‰ -> É
  ['\u00C3\u008D', '\u00CD'], // Ã� -> Í
  ['\u00C3\u0093', '\u00D3'], // Ã“ -> Ó
  ['\u00C3\u009A', '\u00DA'], // Ãš -> Ú
  ['\u00C3\u0091', '\u00D1'], // Ã‘ -> Ñ
  ['\u00C3\u00BC', '\u00FC'], // ü -> ü
  ['\u00C3\u009C', '\u00DC'], // Ãœ -> Ü
  ['\u00C3\u00A7', '\u00E7'], // ç -> ç
]);

// Targeted word fixes (fallbacks)
const wordMap = new Map([
  ['Instalaci\u00C3\u00B3n', 'Instalaci\u00F3n'],
  ['informaci\u00C3\u00B3n', 'informaci\u00F3n'],
  ['Navegaci\u00C3\u00B3n', 'Navegaci\u00F3n'],
  ['Atenci\u00C3\u00B3n', 'Atenci\u00F3n'],
  ['Le\u00C3\u00B3n', 'Le\u00F3n'],
  ['men\u00C3\u00BA', 'men\u00FA'],
  ['m\u00C3\u00B3vil', 'm\u00F3vil'],
  ['Qui\u00C3\u00A9nes', 'Qui\u00E9nes'],
]);

// Usar una string literal en lugar de una regex para evitar caracteres de control
const regexFixes = [
  { re: /Inform.tica/g, out: 'Inform\u00E1tica' },
];

function shouldProcess(file) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('node_modules') || rel.startsWith('.next') || rel.startsWith('.git') || rel.startsWith('.contentlayer')) {return false;}
  return EXTS.has(path.extname(file));
}

function walk(dir, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {walk(p, out);}
    else if (e.isFile() && shouldProcess(p)) {out.push(p);}
  }
  return out;
}

function fixText(text) {
  let out = text;
  for (const [from, to] of charMap.entries()) {out = out.split(from).join(to);}
  for (const [from, to] of utf8Pairs.entries()) {out = out.split(from).join(to);}
  for (const [from, to] of wordMap.entries()) {out = out.split(from).join(to);}
  for (const { re, out: to } of regexFixes) {out = out.replace(re, to);}
  return out;
}

let changed = 0, files = 0;
for (const dir of TARGET_DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) {continue;}
  for (const file of walk(abs)) {
    try {
      const prev = fs.readFileSync(file, 'utf8');
      const next = fixText(prev);
      if (next !== prev) {
        fs.writeFileSync(file, next, 'utf8');
        changed++;
      }
      files++;
    } catch {}
  }
}

console.log(`[encoding-fix] scanned ${files} files, updated ${changed}`);
process.exit(0);

