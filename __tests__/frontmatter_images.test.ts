import fs from 'fs';
import path from 'path';
import { describe, it } from 'vitest';

function extractFrontmatter(text: string): string | null {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  return text.slice(3, end).trim();
}

function extractField(fm: string, key: string): string | null {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const m = fm.match(re);
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    v = v.slice(1, -1);
  }
  return v;
}

describe('Frontmatter images', () => {
  const ROOT = path.resolve(__dirname, '..');
  const contentDir = path.join(ROOT, 'content', 'blog');
  const publicDir = path.join(ROOT, 'public');
  const minBytes = Number(process.env.MIN_IMAGE_BYTES || 1000);

  it('every blog post has an existing, non-trivial hero image', () => {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
    const failures: string[] = [];

    for (const file of files) {
      const p = path.join(contentDir, file);
      const text = fs.readFileSync(p, 'utf8');
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
      const rel = image.replace(/^\//, ''); // strip leading slash
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

    if (failures.length) {
      const msg = failures.join('\n');
      throw new Error(`Frontmatter image checks failed:\n${msg}`);
    }
  });
});

