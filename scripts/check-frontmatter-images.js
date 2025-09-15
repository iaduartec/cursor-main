const fs = require('fs');
const path = require('path');

function extractFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  return text.slice(3, end).trim();
}

function extractField(fm, key) {
  const lines = fm.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(key + ':')) {
      const value = trimmed.substring(key.length + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
      }
      return value;
    }
  }
  return null;
}

const ROOT = path.resolve(__dirname, '..');
const contentDir = path.join(ROOT, 'content', 'blog');
const publicDir = path.join(ROOT, 'public');

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
const failures = [];

for (const file of files) {
  const p = path.join(contentDir, file);
  const text = fs.readFileSync(p, 'utf8');
  const fm = extractFrontmatter(text);
  if (!fm) {
    failures.push(file + ': missing frontmatter block');
    continue;
  }
  const image = extractField(fm, 'image');
  if (!image) {
    failures.push(file + ': missing image field in frontmatter');
    continue;
  }
  const rel = image.startsWith('/') || image.startsWith('\\') ? image.slice(1) : image;
  const onDisk = path.join(publicDir, rel);
  if (!fs.existsSync(onDisk)) {
    failures.push(file + ': image path not found -> ' + onDisk);
    continue;
  }
  const size = fs.statSync(onDisk).size;
  if (size < 1000) {
    failures.push(file + ': image too small (' + size + ' bytes) -> ' + onDisk);
  }
}

if (failures.length) {
  console.error('Frontmatter image checks failed:\n' + failures.join('\n'));
  process.exitCode = 2;
} else {
  console.log('All images present and large enough');
}
