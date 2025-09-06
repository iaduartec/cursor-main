#!/usr/bin/env node
// Fix common mojibake issues from mis-encoded Spanish characters across the repo.
// Scans selected folders and applies targeted replacements.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'components', 'content', 'scripts'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.jsx', '.json', '.md', '.mdx', '.css', '.yml', '.yaml']);

// Character-level fixes
const charMap = new Map([
  ['á', 'á'],
  ['é', 'é'],
  ['ú', 'ú'],
]);

// Word-level fixes for typical double replacement artifacts
const wordMap = new Map([
  ['Instalación', 'Instalación'],
  ['instalación', 'instalación'],
  ['información', 'información'],
  ['Atención', 'Atención'],
  ['León', 'León'],
  ['Código', 'Código'],
  ['cámaras', 'cámaras'],
  ['Cámaras', 'Cámaras'],
  ['cámaras', 'cámaras'],
  ['Cámaras', 'Cámaras'],
  ['Informáticas', 'Informáticas'],
  ['informática', 'informática'],
  ['Informáticas', 'Informáticas'],
  ['Calidad, experiencia y cercanía', 'Calidad, experiencia y cercanía'],
  ['Saber más', 'Saber más'],
  ['Navegación', 'Navegación'],
  ['Botón', 'Botón'],
  ['menú', 'menú'],
  ['móvil', 'móvil'],
  ['específicas', 'específicas'],
  ['emisión', 'emisión'],
  ['galería', 'galería'],
  ['rápido', 'rápido'],
  ['públicos', 'públicos'],
  ['eléctricas', 'eléctricas'],
  ['Quiénes', 'Quiénes'],
]);

// Also fix known odd control-sequence typos
const regexFixes = [
  { re: /Inform\u001atica/g, out: 'Informática' },
];

function shouldProcess(file) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('node_modules') || rel.startsWith('.next') || rel.startsWith('.git') || rel.startsWith('.contentlayer')) {
    return false;
  }
  return EXTS.has(path.extname(file));
}

function walk(dir, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && shouldProcess(p)) out.push(p);
  }
  return out;
}

function fixText(text) {
  let out = text;
  // Character-level replacements
  for (const [from, to] of charMap.entries()) out = out.split(from).join(to);
  // Word-level replacements
  for (const [from, to] of wordMap.entries()) out = out.split(from).join(to);
  // Regex fixes
  for (const { re, out: to } of regexFixes) out = out.replace(re, to);
  return out;
}

let changed = 0, files = 0;
for (const dir of TARGET_DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
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

