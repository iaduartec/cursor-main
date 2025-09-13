import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);
  return { content, frontmatter: data };
}

export function getAllPosts() {
  const dirPath = path.join(process.cwd(), 'content', 'blog');
  const files = fs.readdirSync(dirPath);
  return files.filter(f => f.endsWith('.mdx')).map(f => {
    const slug = f.replace(/\.mdx$/, '');
    return getPost(slug);
  });
}
