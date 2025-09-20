#!/usr/bin/env node
<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

scripts/generate_missing_images_runner.js

2025-09-13T06:20:07.386Z

——————————————————————————————
Archivo .js: generate_missing_images_runner.js
Tamaño: 7314 caracteres, 203 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
// Lightweight wrapper to run the Python placeholder generator when available.
// On environments without Python (e.g., Vercel build), it logs a warning and exits 0.

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const repoRoot = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const scriptPath = path.join(repoRoot, 'tools', 'generate_missing_images.py');

// Default args if none provided
const userArgs = process.argv.slice(2);
const defaultArgs = ['--only-missing', '--min-bytes', '1000'];
// Build args for the python script (it doesn't support --force)
const passthrough = (userArgs.length ? userArgs : defaultArgs).filter(a => a !== '--force');
const args = [scriptPath, ...passthrough];

function parseFlag(name, fallback) {
  const idx = userArgs.findIndex(a => a === `--${name}`);
  if (idx === -1) {return fallback;}
  const val = userArgs[idx + 1];
  if (val === undefined || val.startsWith('--')) {return true;}
  if (name === 'min-bytes') {return parseInt(val, 10) || fallback;}
  return val;
}

const onlyMissing = userArgs.includes('--only-missing') || !userArgs.length;
const force = userArgs.includes('--force') || process.env.PLACEHOLDERS_FORCE === '1';
const dryRun = userArgs.includes('--dry-run');
const minBytes = parseFlag('min-bytes', 1000);
const preferNode = userArgs.includes('--node') || userArgs.includes('--skip-python') || process.env.PLACEHOLDERS_PREFER_NODE === '1';
const filterText = parseFlag('filter', null);

function tryRun(interpreter) {
  try {
    const res = spawnSync(interpreter, args, { stdio: 'inherit' });
    if (res.error && res.error.code === 'ENOENT') {return { ran: false };}
    // Non-zero exit: on Vercel, do not fail the build; otherwise bubble up
    if (typeof res.status === 'number' && res.status !== 0) {
      const msg = `generate_missing_images failed with code ${res.status} using ${interpreter}`;
      if (isVercel) {
        console.warn(`[WARN] ${msg} — skipping on Vercel.`);
        return { ran: true, skipped: true };
      }
      process.exit(res.status);
    }
    return { ran: true };
  } catch (e) {
    if (e && e.code === 'ENOENT') {return { ran: false };}
    // Any other unexpected error: do not break Vercel builds
    console.warn(`[WARN] Unexpected error running ${interpreter}: ${e && e.message}`);
    if (!isVercel) {process.exit(1);}
    return { ran: false, skipped: true };
  }
}

if (!preferNode && fs.existsSync(scriptPath)) {
  let result = tryRun('python');
  if (!result.ran) {result = tryRun('python3');}
  if (result.ran) {process.exit(0);}
  console.warn('[WARN] Python not available, will try Node fallback (sharp).');
}

// Node fallback: generate simple WEBP placeholders using sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('[WARN] sharp is not installed. Skipping placeholder generation.');
  process.exit(0);
}

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'blog');
const STOCK_DIR = path.join(ROOT, 'public', 'images', 'proyectos');

function extractFrontmatter(text) {
  if (!text.startsWith('---')) {return null;}
  const end = text.indexOf('\n---', 3);
  if (end === -1) {return null;}
  return text.slice(3, end).trim();
}

function extractField(fm, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const m = fm.match(re);
  if (!m) {return null;}
  let v = m[1].trim();
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    v = v.slice(1, -1);
  }
  return v;
}

function targetFromImageField(imagePath, fallbackSlug) {
  if (imagePath && imagePath.includes('/images/blog/')) {
    try {
      const tail = imagePath.split('/images/blog/')[1];
      const dirSlug = tail.split('/')[0];
      const filename = `${dirSlug}-hero-001.webp`;
      return { dirSlug, target: path.join(IMAGES_DIR, dirSlug, filename) };
    } catch (e) {
      // fall through
    }
  }
  const dirSlug = fallbackSlug;
  const filename = `${dirSlug}-hero-001.webp`;
  return { dirSlug, target: path.join(IMAGES_DIR, dirSlug, filename) };
}

function stockForCategory(category) {
  const map = new Map([
    ['Seguridad', 'CCTV.jpeg'],
    ['Electricidad', 'electricidad.jpeg'],
    ['Informática', 'servers.jpeg'],
    ['Informatica', 'servers.jpeg'],
    ['Informática', 'servers.jpeg'],
    ['Sonido', 'sonido.jpeg'],
    ['General', 'seguridad_red.jpeg'],
  ]);
  const key = (category || 'General').trim();
  const file = map.get(key) || map.get('General');
  const p = path.join(STOCK_DIR, file);
  return fs.existsSync(p) ? p : null;
}

function listMDX(dir) {
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).map(f => path.join(dir, f));
  } catch {
    return [];
  }
}

async function createWebpFromStock(srcPath, outPath) {
  const width = 1920, height = 1080;
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await sharp(srcPath)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .webp({ quality: 85 })
    .toFile(outPath);
}

async function createWebpPlaceholder(outPath) {
  const width = 1920, height = 1080;
  const background = '#e2e8f0'; // slate-200
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await sharp({ create: { width, height, channels: 3, background } })
    .webp({ quality: 80 })
    .toFile(outPath);
}

(async () => {
  const files = listMDX(CONTENT_DIR);
  let created = 0, skipped = 0, candidates = 0;
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const fm = extractFrontmatter(text);
    const slug = (fm && extractField(fm, 'slug')) || path.basename(file, '.mdx');
    const category = (fm && extractField(fm, 'category')) || 'General';
    const image = fm && extractField(fm, 'image');
    const title = (fm && extractField(fm, 'title')) || slug.replace(/-/g, ' ');

    if (filterText) {
      const key = `${slug} ${title}`.toLowerCase();
      if (!key.includes(String(filterText).toLowerCase())) {
        continue;
      }
    }
    const { target } = targetFromImageField(image, slug);
    let size = 0;
    if (fs.existsSync(target)) {
      try { size = fs.statSync(target).size; } catch {}
    }
    const needs = force || (!fs.existsSync(target)) || (size < minBytes);
    if (onlyMissing && !needs) { skipped++; continue; }
    candidates++;
    console.log(`[GEN] ${path.basename(file)} -> ${path.relative(ROOT, target)}`);
    if (dryRun) {continue;}
    try {
      const stock = stockForCategory(category);
      if (stock) {
        await createWebpFromStock(stock, target);
      } else {
        await createWebpPlaceholder(target);
      }
      const outSize = fs.statSync(target).size;
      console.log(`   created: ${path.relative(ROOT, target)} (${outSize} bytes)`);
      created++;
    } catch (e) {
      console.warn(`   error: ${e && e.message}`);
    }
  }
  console.log('\nSummary:');
  console.log(`  Candidates: ${candidates}`);
  console.log(`  Created:    ${created}`);
  console.log(`  Skipped:    ${skipped}`);
  process.exit(0);
})().catch(() => process.exit(0));
