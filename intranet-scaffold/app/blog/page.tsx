import Link from 'next/link';
import { getAllPosts } from '../../lib/mdx';

export default function BlogListPage() {
  const posts = getAllPosts();
  return (
    <main style={{ padding: 24 }}>
      <h1>Blog</h1>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>
            <Link href={`/blog/${post.frontmatter.slug}`}>
              {post.frontmatter.title}
            </Link>
            <span style={{ marginLeft: 8, color: '#888' }}>{post.frontmatter.date}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
