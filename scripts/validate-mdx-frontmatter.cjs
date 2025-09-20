const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function findMdxFiles(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...findMdxFiles(full));
    } else if (stat.isFile() && full.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');

if (!fs.existsSync(contentDir)) {
  console.log('[validate-mdx] No existe carpeta content/. Saltando.');
  process.exit(0);
}

const mdxFiles = findMdxFiles(contentDir);
let errors = 0;
for (const file of mdxFiles) {
  const raw = fs.readFileSync(file, 'utf8');
  try {
    matter(raw);
  } catch (err) {
    console.error(`[validate-mdx] Error en ${file}: ${err.message}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`[validate-mdx] Encontrados ${errors} archivos MDX con frontmatter inválido.`);
  process.exit(2);
}

console.log(`[validate-mdx] OK: ${mdxFiles.length} archivos MDX validados.`);
