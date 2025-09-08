#!/usr/bin/env node
/*
 * Normalize MDX front matter strictly and separate body correctly.
 * - Keeps only known keys for Blog docs.
 * - Stops front matter at the first non `key: value` line.
 * - Removes stray closing `---` at EOF if present.
 * - Normalizes `slug` and, if needed, renames file to match.
 */

const fs = require('fs');
const path = require('path');

const BLOG_KEYS = new Set(['title', 'date', 'description', 'slug', 'category', 'image', 'schema']);

function normalizeSlug(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fixFile(fp) {
  const raw = fs.readFileSync(fp, 'utf8');
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  let i = 0;
  const fm = {};
  let bodyStart = 0;

  // If starts with '---', parse front matter header lines
  if (lines[0] && lines[0].trim() === '---') {
    i = 1;
    for (; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (trimmed === '---') { // found explicit closing
        i++;
        break;
      }
      const idx = line.indexOf(':');
      if (idx <= 0) { // not a key: value => body starts here
        break;
      }
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (!BLOG_KEYS.has(key)) {
        // Encountered a key we don't care about; still allow it but only if simple
        if (!/^[^:]+: *.+$/.test(line)) { break; }
      }
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[key] = val;
    }
    bodyStart = i;
  }

  // Body is the rest of the file from bodyStart
  let body = lines.slice(bodyStart).join('\n');
  // Remove a trailing standalone '---' at the end if present
  body = body.replace(/\n?-{3}\s*$/,'').trimStart();

  // Compute slug
  const baseName = path.basename(fp, '.mdx');
  const slugSource = fm.slug || fm.title || baseName;
  const normalizedSlug = normalizeSlug(slugSource);
  fm.slug = normalizedSlug;

  // Rebuild content
  const fmOut = ['---'];
  const keys = ['title', 'description', 'date', 'slug', 'category', 'image'];
  for (const key of keys) {
    const v = fm[key];
    if (v === null || v === undefined || String(v).length === 0) {continue;}
    let outVal = String(v);
    // Quote all string values to avoid YAML parse errors with ':' and unicode
    if (key === 'date') {
      // keep ISO date as-is
      // No necesitamos reasignar el valor
    } else {
      // escape existing quotes
      outVal = `"${  outVal.replace(/\\/g, '\\\\').replace(/"/g, '\\"')  }"`;
    }
    fmOut.push(`${key}: ${outVal}`);
  }
  fmOut.push('---', '');
  const out = fmOut.join('\n') + body.replace(/^\n+/, '');

  if (out !== raw) {
    fs.writeFileSync(fp, out, 'utf8');
    console.log(`[fix] rewrote ${fp}`);
  }

  // Rename if needed
  const newPath = path.join(path.dirname(fp), `${normalizedSlug  }.mdx`);
  if (newPath !== fp) {
    if (!fs.existsSync(newPath)) {
      fs.renameSync(fp, newPath);
      console.log(`[fix] renamed ${fp} -> ${newPath}`);
      return newPath;
    } else {
      console.warn(`[fix] target exists, skip rename: ${newPath}`);
    }
  }
  return fp;
}

function run(dir) {
  const root = path.resolve(dir);
  const files = fs.readdirSync(root).filter(f => f.endsWith('.mdx')).map(f => path.join(root, f));
  let changed = 0;
  for (const fp of files) {
    const newFp = fixFile(fp);
    if (newFp !== fp) {changed++;}
  }
  console.log(`[fix] done. processed ${files.length} file(s).`);
}

const target = process.argv[2] || path.join(process.cwd(), 'content', 'blog');
run(target);
