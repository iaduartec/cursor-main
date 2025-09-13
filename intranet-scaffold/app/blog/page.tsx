import Link from 'next/link';
import { getAllPosts } from '../../lib/mdx';

export default function BlogListPage() {
  const posts = getAllPosts();
  return (
    <main style={{ padding: 24 }}>
      <h1>Blog</h1>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx} style={{ marginBottom: 24 }}>
            <Link href={`/blog/${post.frontmatter.slug}`}>
              <strong>{post.frontmatter.title}</strong>
            </Link>
            <span style={{ marginLeft: 8, color: '#888' }}>{post.frontmatter.date}</span>
            {post.frontmatter.description && (
              <p style={{ margin: '4px 0 0 0', color: '#555' }}>{post.frontmatter.description}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
