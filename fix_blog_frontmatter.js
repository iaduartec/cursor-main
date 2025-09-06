#!/usr/bin/env node
/*
 * Fix MDX front matter and slugs.
 *
 * This script scans all `.mdx` files in a given directory (default
 * `content/blog`) and performs two fixes:
 *
 * 1. **Merge multiple front‑matter blocks**: some files may contain more than
 *    one `---` delimited block at the top. The script merges all such
 *    blocks into a single front‑matter section. If the same key appears in
 *    multiple blocks, the value from the last block wins.
 *
 * 2. **Normalize the `slug` field and rename files**: After merging the
 *    front matter, the script ensures the `slug` value contains only ASCII
 *    characters (lower‑cased, accents removed, and non‑alphanumerics
 *    collapsed to hyphens). If the slug differs from the file name, the
 *    file is renamed to match. It also writes back the normalized slug to
 *    the front‑matter.
 *
 * Usage:
 *   node fix_blog_frontmatter.js [directory]
 *
 * When no directory is provided, it defaults to `content/blog` relative to
 * the script location.
 */

const fs = require('fs');
const path = require('path');

// Normalize a string into a slug: lower case, remove accents, collapse
// non‑alphanumeric characters into hyphens, trim extra hyphens.
function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Collect all `.mdx` files recursively under a directory
function collectMdxFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      collectMdxFiles(fullPath, list);
    } else if (stat.isFile() && entry.toLowerCase().endsWith('.mdx')) {
      list.push(fullPath);
    }
  }
  return list;
}

// Parse one or more front‑matter blocks at the top of the file.
// Returns an object { frontMatter: object, body: string }.
function parseMultipleFrontMatter(content) {
  let index = 0;
  const fmData = {};
  while (content.startsWith('---', index)) {
    const start = index + 3; // skip '---'
    const next = content.indexOf('\n---', start);
    if (next === -1) break;
    const block = content.slice(start, next).trim();
    for (const line of block.split(/\r?\n/)) {
      const idx = line.indexOf(':');
      if (idx <= 0) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // Remove surrounding quotes
      if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      fmData[key] = value;
    }
    index = next + 4; // move past '\n---'
  }
  const body = content.slice(index);
  return { frontMatter: fmData, body };
}

// Serialize front matter back into a single block
function serializeFrontMatter(data) {
  const lines = ['---'];
  for (const [key, val] of Object.entries(data)) {
    lines.push(`${key}: ${val}`);
  }
  lines.push('---\n');
  return lines.join('\n');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { frontMatter, body } = parseMultipleFrontMatter(content);
  // Determine source for slug: explicit slug or title or filename
  const baseName = path.basename(filePath, '.mdx');
  const slugSource = frontMatter.slug || frontMatter.title || baseName;
  const normalizedSlug = normalizeSlug(slugSource);
  let modified = false;
  if (frontMatter.slug !== normalizedSlug) {
    frontMatter.slug = normalizedSlug;
    modified = true;
  }
  // Rebuild file with single front matter block
  const newContent = serializeFrontMatter(frontMatter) + body;
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    modified = true;
    console.log(`Merged front matter in ${filePath}`);
  }
  // Rename file if basename differs
  if (baseName !== normalizedSlug) {
    const newPath = path.join(path.dirname(filePath), `${normalizedSlug}.mdx`);
    if (!fs.existsSync(newPath)) {
      fs.renameSync(filePath, newPath);
      console.log(`Renamed file ${filePath} -> ${newPath}`);
    } else {
      console.warn(`File ${newPath} already exists; skipping rename of ${filePath}`);
    }
  }
  return modified;
}

function run(directory) {
  const targetDir = path.resolve(directory);
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }
  const files = collectMdxFiles(targetDir);
  let count = 0;
  for (const file of files) {
    if (processFile(file)) {
      count++;
    }
  }
  console.log(`Processed ${files.length} files. Updated ${count} file(s).`);
}

// Determine directory from CLI argument or default
const dirArg = process.argv[2] || path.join(__dirname, 'content', 'blog');
run(dirArg);