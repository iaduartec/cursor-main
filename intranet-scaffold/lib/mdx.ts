/**
Resumen generado automáticamente.

intranet-scaffold/lib/mdx.ts

2025-09-13T06:20:07.376Z

——————————————————————————————
Archivo .ts: mdx.ts
Tamaño: 763 caracteres, 24 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPostsMeta() {
  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '');
      const source = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
      const { data } = matter(source);
      return { slug, frontmatter: data };
    });
}

export async function getPostSerialized(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const sourceRaw = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(sourceRaw);
  return { source: content, frontmatter: data };
}
