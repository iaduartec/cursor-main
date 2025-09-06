#!/usr/bin/env node
/*
 * Fix MDX front matter and slugs robustly.
 *
 * Several of the MDX blog posts in this repository accidentally include
 * more than one front‑matter block separated by `---` lines. When
 * processed by Next.js and contentlayer, only the first block is parsed
 * as metadata and subsequent blocks are treated as part of the page
 * content. This leads to errors at build time because the resulting
 * module exports are undefined. Additionally, some posts may define
 * slugs with accented characters, which results in URL encodings like
 * `ca3mo` or `implementacia3n` in the build output.
 *
 * This script walks through all `.mdx` files in a specified directory
 * (default: `content/blog`), merges multiple front‑matter blocks into
 * a single block, normalises the `slug` field to ASCII characters
 * (lower‑cased, accents removed, and non‑alphanumerics collapsed to
 * hyphens), and renames the file to match the slug if necessary.
 *
 * Usage:
 *   node fix_blog_frontmatter_merge.js [directory]
 */

const fs = require('fs');
const path = require('path');

// Normalise a string into a slug: lower case, remove accents, collapse
// non‑alphanumeric characters into hyphens, trim leading/trailing hyphens.
function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Recursively collect all `.mdx` files under `dir`.
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

/*
 * Parse one or more front‑matter blocks at the top of an MDX file.
 *
 * We split the file by lines consisting solely of `---` using a
 * regular expression. A typical MDX with two blocks might look like:
 *
 * ---\n
 * slug: foo\n
 *\n
 * ---\n
 * title: Bar\n
 * description: Baz\n
 * ---\n
 * # Content
 *
 * After splitting by /^---\s*$/m we obtain an array where the first
 * element is an empty string (because the file starts with `---`), the
 * subsequent elements alternate between metadata blocks and other
 * sections. We treat any consecutive blocks that contain `:` as
 * metadata and merge their key–value pairs. The remainder of the file
 * becomes the content body. If no front‑matter block is found, the
 * entire file is returned as body with an empty metadata object.
 */
function parseMultipleFrontMatter(content) {
  // Use CRLF/CR to LF normalisation for splitting consistency.
  const normalized = content.replace(/\r\n?/g, '\n');
  const parts = normalized.split(/^---\s*$/m);
  // If the file does not start with a front‑matter delimiter, return as is.
  if (parts.length === 1 || parts[0].trim() !== '') {
    return { frontMatter: {}, body: content };
  }
  let frontMatterData = {};
  let bodyStartIndex = 1;
  // Iterate over blocks after the initial empty string. Collect all
  // metadata blocks (those containing a colon) until we hit a block
  // without a colon (the beginning of the body).
  for (let i = 1; i < parts.length; i++) {
    const block = parts[i].trim();
    if (!block || !block.includes(':')) {
      bodyStartIndex = i;
      break;
    }
    for (const line of block.split(/\n+/)) {
      const idx = line.indexOf(':');
      if (idx <= 0) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // Remove surrounding quotes from the value.
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontMatterData[key] = value;
    }
    bodyStartIndex = i + 1;
  }
  // Reconstruct the body from the remaining parts. We must reinsert the
  // front‑matter delimiter before the body to avoid losing any `---`
  // sequences inside the content.
  const bodySections = parts.slice(bodyStartIndex);
  const body = bodySections.join('---\n');
  return { frontMatter: frontMatterData, body };
}

// Serialize the merged front matter back into a single block.
function serializeFrontMatter(data) {
  const lines = ['---'];
  for (const [key, val] of Object.entries(data)) {
    lines.push(`${key}: ${val}`);
  }
  lines.push('---\n');
  return lines.join('\n');
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const { frontMatter, body } = parseMultipleFrontMatter(original);
  // Determine slug source: explicit slug, title or filename.
  const baseName = path.basename(filePath, '.mdx');
  const slugSource = frontMatter.slug || frontMatter.title || baseName;
  const normalizedSlug = normalizeSlug(slugSource);
  let updated = false;
  if (frontMatter.slug !== normalizedSlug) {
    frontMatter.slug = normalizedSlug;
    updated = true;
  }
  // Build new file content.
  const newContent = serializeFrontMatter(frontMatter) + body;
  if (newContent !== original) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    updated = true;
    console.log(`Fixed front matter in ${filePath}`);
  }
  // Rename file if needed.
  if (baseName !== normalizedSlug) {
    const dir = path.dirname(filePath);
    const newPath = path.join(dir, `${normalizedSlug}.mdx`);
    if (!fs.existsSync(newPath)) {
      fs.renameSync(filePath, newPath);
      console.log(`Renamed file ${filePath} -> ${newPath}`);
    } else {
      console.warn(`Cannot rename ${filePath}, ${newPath} already exists.`);
    }
  }
  return updated;
}

function run(directory) {
  const targetDir = path.resolve(directory);
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }
  const files = collectMdxFiles(targetDir);
  let updatedCount = 0;
  for (const file of files) {
    if (processFile(file)) updatedCount++;
  }
  console.log(`Processed ${files.length} file(s). Updated ${updatedCount} file(s).`);
}

const dirArg = process.argv[2] || path.join(__dirname, 'content', 'blog');
run(dirArg);