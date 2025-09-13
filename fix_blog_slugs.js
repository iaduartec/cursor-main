/**
Resumen generado automáticamente.

fix_blog_slugs.js

2025-09-13T06:20:07.371Z

——————————————————————————————
Archivo .js: fix_blog_slugs.js
Tamaño: 3591 caracteres, 105 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
#!/usr/bin/env node
/*
 * This utility scans every MDX file under the `content/blog` directory
 * and ensures that the `slug` field in the front‑matter contains only
 * normalized ASCII characters. It uses the same normalization logic as
 * the `normalizeSlug` function in `app/blog/[slug]/page.tsx`:
 *   - convert to lowercase
 *   - decompose accented characters (NFD) and remove the diacritics
 *   - collapse any sequence of non‑alphanumeric characters into a single hyphen
 *   - trim leading or trailing hyphens
 * If a file is missing a `slug` field, the script derives the slug from the
 * file name (excluding the extension). After normalization, the slug is
 * written back into the front‑matter if it differs from the existing value.
 *
 * Usage: node fix_blog_slugs.js
 */

const fs = require('fs');
const path = require('path');

// Normalize a string to a URL‑friendly slug
function normalizeSlug(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Locate all .mdx files within a directory recursively
function getMdxFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getMdxFiles(fullPath, files);
    } else if (stat.isFile() && fullPath.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Read a file and return an object with front matter and body
function parseFrontMatter(content) {
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*(\n|$)/;
  const match = content.match(fmRegex);
  if (!match) {
    return { frontMatter: {}, body: content };
  }
  const fmContent = match[1];
  const body = content.slice(match[0].length);
  const frontMatter = {};
  for (const line of fmContent.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) {continue;}
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    frontMatter[key] = value;
  }
  return { frontMatter, body };
}

// Serialize front matter back to a YAML‑like block
function serializeFrontMatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    lines.push(`${key}: ${value}`);
  }
  lines.push('---\n');
  return lines.join('\n');
}

function fixSlugs() {
  const blogDir = path.join(__dirname, 'content', 'blog');
  if (!fs.existsSync(blogDir)) {
    console.error(`Directory not found: ${blogDir}`);
    process.exit(1);
  }
  const mdxFiles = getMdxFiles(blogDir);
  let updated = 0;
  for (const file of mdxFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const { frontMatter, body } = parseFrontMatter(content);
    // Determine the source for slug: explicit field, or filename
    const baseName = path.basename(file, '.mdx');
    const currentSlug = frontMatter.slug || baseName;
    const normalized = normalizeSlug(currentSlug);
    if (frontMatter.slug !== normalized) {
      frontMatter.slug = normalized;
      const newContent = serializeFrontMatter(frontMatter) + body;
      fs.writeFileSync(file, newContent, 'utf8');
      updated++;
      console.log(`Updated slug in ${path.relative(process.cwd(), file)} -> ${normalized}`);
    }
  }
  console.log(`Finished. Updated ${updated} file(s).`);
}

fixSlugs();