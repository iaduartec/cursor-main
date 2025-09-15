#!/usr/bin/env node
/**
Resumen generado automáticamente.

fix_blog_slugs_extended.js

2025-09-13T06:20:07.372Z

——————————————————————————————
Archivo .js: fix_blog_slugs_extended.js
Tamaño: 4745 caracteres, 134 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
/*
 * Extended blog slug fixer.
 *
 * This script scans all `.mdx` files inside a given directory (default
 * `content/blog`) and normalizes the slug of each post using the same
 * logic as in your Next.js application. It goes beyond simply updating
 * the `slug` field: if the normalized slug differs from the current file
 * name, it will also rename the file accordingly. This helps avoid
 * situations where the file name and slug diverge, which can be a
 * source of confusion or build errors. The script logs all changes it
 * makes and reports a summary at the end.
 *
 * Usage:
 *   node fix_blog_slugs_extended.js [directory]
 *
 *   directory: (optional) root directory to search for `.mdx` files.
 *              Defaults to `content/blog` relative to the script's
 *              location.
 */

const fs = require('fs');
const path = require('path');

// Normalize a string into a slug: lower case, remove accents, collapse
// non-alphanumeric characters into hyphens, trim extra hyphens.
function normalizeSlug(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Recursively collect all `.mdx` files under a directory
function collectMdxFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectMdxFiles(full, list);
    } else if (stat.isFile() && entry.toLowerCase().endsWith('.mdx')) {
      list.push(full);
    }
  }
  return list;
}

// Very simple front‑matter parser. It returns an object with
// `frontMatter` (key/value pairs) and `body` (string). Only top-level
// single‑line key: value entries are supported. If no front matter is
// found, `frontMatter` is empty.
function parseFrontMatter(content) {
  const fmStart = content.indexOf('---\n');
  if (fmStart !== 0) {
    return { frontMatter: {}, body: content };
  }
  const fmEnd = content.indexOf('\n---', fmStart + 4);
  if (fmEnd === -1) {
    return { frontMatter: {}, body: content };
  }
  const fmLines = content.slice(4, fmEnd).split(/\r?\n/);
  const frontMatter = {};
  for (const line of fmLines) {
    const idx = line.indexOf(':');
    if (idx <= 0) {continue;}
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    frontMatter[key] = val;
  }
  const body = content.slice(fmEnd + 4);
  return { frontMatter, body };
}

function serializeFrontMatter(obj) {
  const lines = ['---'];
  for (const [key, val] of Object.entries(obj)) {
    lines.push(`${key}: ${val}`);
  }
  lines.push('---\n');
  return lines.join('\n');
}

function fixSlugs(rootDir) {
  const resolvedDir = path.resolve(rootDir);
  if (!fs.existsSync(resolvedDir)) {
    console.error(`Error: directory not found: ${resolvedDir}`);
    process.exit(1);
  }
  const files = collectMdxFiles(resolvedDir);
  let updatedCount = 0;
  let renamedCount = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const { frontMatter, body } = parseFrontMatter(content);
    const fileName = path.basename(file, '.mdx');
    const source = frontMatter.slug || frontMatter.title || fileName;
    const normalized = normalizeSlug(source);
    let changed = false;
    // Update slug field if different
    if (frontMatter.slug !== normalized) {
      frontMatter.slug = normalized;
      changed = true;
    }
    // Build new content if anything changed
    if (changed) {
      const newContent = serializeFrontMatter(frontMatter) + body;
      fs.writeFileSync(file, newContent, 'utf8');
      updatedCount++;
      console.log(`Updated slug in ${path.relative(process.cwd(), file)} -> ${normalized}`);
    }
    // Rename file if its basename differs from normalized slug
    if (fileName !== normalized) {
      const newPath = path.join(path.dirname(file), `${normalized  }.mdx`);
      // If destination exists, avoid overwriting
      if (!fs.existsSync(newPath)) {
        fs.renameSync(file, newPath);
        renamedCount++;
        console.log(`Renamed file ${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), newPath)}`);
      } else {
        console.warn(`Skipped renaming ${file} because ${newPath} already exists`);
      }
    }
  }
  console.log(`Finished. Updated ${updatedCount} slug(s), renamed ${renamedCount} file(s).`);
}

// Determine directory from CLI argument or default
const targetDir = process.argv[2] || path.join(__dirname, 'content', 'blog');
fixSlugs(targetDir);