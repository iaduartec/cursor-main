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
