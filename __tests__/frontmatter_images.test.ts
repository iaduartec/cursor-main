<<<<<<< HEAD
import fs from 'fs';
import path from 'path';

function extractFrontmatter(text: string): string | null {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
=======
import fs from "fs";
import path from "path";
import { describe, it } from "vitest";

function extractFrontmatter(text: string): string | null {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  if (end === -1) return null;
  return text.slice(3, end).trim();
}

function extractField(fm: string, key: string): string | null {
<<<<<<< HEAD
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
=======
  const lines = fm.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(key + ":")) {
      const value = trimmed.substring(key.length + 1).trim();
      // strip surrounding single or double quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
      }
      return value;
    }
  }
  return null;
}

describe("Frontmatter images", () => {
  const ROOT = path.resolve(__dirname, "..");
  const contentDir = path.join(ROOT, "content", "blog");
  const publicDir = path.join(ROOT, "public");
  const minBytes = Number(process.env.MIN_IMAGE_BYTES || 1000);

  it("every blog post has an existing, non-trivial hero image", () => {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".mdx"));
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
    const failures: string[] = [];

    for (const file of files) {
      const p = path.join(contentDir, file);
<<<<<<< HEAD
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
=======
      const text = fs.readFileSync(p, "utf8");
      const fm = extractFrontmatter(text);
      if (!fm) {
        failures.push(file + ": missing frontmatter block");
        continue;
      }
      const image = extractField(fm, "image");
      if (!image) {
        failures.push(file + ": missing image field in frontmatter");
        continue;
      }
      // strip single leading slash or backslash if present
      const rel = image.startsWith('/') || image.startsWith('\\') ? image.slice(1) : image;
      const onDisk = path.join(publicDir, rel);
      if (!fs.existsSync(onDisk)) {
        failures.push(file + ": image path not found -> " + onDisk);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
        continue;
      }
      const size = fs.statSync(onDisk).size;
      if (size < minBytes) {
<<<<<<< HEAD
        failures.push(`${file}: image too small (${size} bytes) -> ${image}`);
=======
        failures.push(file + ": image too small (" + size + " bytes) -> " + onDisk);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
      }
    }

    if (failures.length) {
<<<<<<< HEAD
      const msg = failures.join('\n');
      throw new Error(`Frontmatter image checks failed:\n${msg}`);
    }
  });
});

=======
      const msg = failures.join("\n");
      throw new Error("Frontmatter image checks failed:\n" + msg);
    }
  });
});
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
