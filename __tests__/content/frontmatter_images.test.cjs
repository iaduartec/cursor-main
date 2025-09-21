const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function extractFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  return text.slice(3, end).trim();
}

function extractField(fm, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm');
  const match = fm.match(re);
  if (!match) return null;
  let value = match[1].trim();
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    value = value.slice(1, -1);
  }
  return value;
}

describe('Frontmatter images', () => {
  const root = path.resolve(__dirname, '..', '..');
  const contentDir = path.join(root, 'content', 'blog');
  const publicDir = path.join(root, 'public');
  const minBytes = Number(process.env.MIN_IMAGE_BYTES || 1000);

  it('every blog post has an existing, non-trivial hero image', () => {
    const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.mdx'));
    const failures = [];

    for (const file of files) {
      const filePath = path.join(contentDir, file);
      const text = fs.readFileSync(filePath, 'utf8');
      const fm = extractFrontmatter(text);
      if (!fm) {
        failures.push(`${file}: missing frontmatter block`);
        continue;
      }

      const image = extractField(fm, 'image');
      if (!image) {
        failures.push(`${file}: missing 'image' field in frontmatter`);
        continue;
      }

      const rel = image.replace(/^\//, '');
      const onDisk = path.join(publicDir, rel);
      if (!fs.existsSync(onDisk)) {
        failures.push(`${file}: image path not found -> ${image}`);
        continue;
      }

      const size = fs.statSync(onDisk).size;
      if (size < minBytes) {
        failures.push(`${file}: image too small (${size} bytes) -> ${image}`);
      }
    }

    assert.deepStrictEqual(failures, [], `Frontmatter image checks failed:\n${failures.join('\n')}`);
  });
});
