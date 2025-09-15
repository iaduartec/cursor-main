const fs = require('fs');
const path = require('path');

function findMdxFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {out.push(...findMdxFiles(full));}
    else if (stat.isFile() && full.endsWith('.mdx')) {out.push(full);}
  }
  return out;
}

const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');
if (!fs.existsSync(contentDir)) {
  console.error('No content dir');
  process.exit(0);
}

const files = findMdxFiles(contentDir);
for (const file of files) {
  const raw = fs.readFileSync(file);
  const s = raw.toString('utf8');
  const lines = s.split(/\r?\n/);
  if (lines[0].trim() !== '---') {continue;}
  let end = -1;
  for (let i = 1; i < Math.min(lines.length, 40); i++) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end === -1) {continue;}
  // inspect each char in frontmatter
  let bad = false;
  for (let i = 1; i < end+1; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const code = lines[i].charCodeAt(j);
      if (code === 0) {
        console.log(`${file}: NUL at line ${i+1} col ${j+1}`);
        bad = true;
      }
      // control chars except tab (9) and space(32)
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
        console.log(`${file}: control char ${code} at line ${i+1} col ${j+1}`);
        bad = true;
      }
    }
  }
  // check trailing spaces
  for (let i = 1; i < end; i++) {
    if (/\s$/.test(lines[i])) {
      console.log(`${file}: trailing whitespace at line ${i+1}`);
      bad = true;
    }
  }
  if (bad) {console.log(`-- problem found in ${file}`);}
}
