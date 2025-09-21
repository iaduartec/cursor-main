/**
Resumen generado automáticamente.

intranet-scaffold/app/blog/page.tsx

2025-09-13T06:20:07.374Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 760 caracteres, 25 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import Link from 'next/link';
import { getAllPostsMeta } from '../../lib/mdx';

export default function BlogListPage() {
  const posts = getAllPostsMeta();
  return (
    <main style={{ padding: 24 }}>
      <h1>Blog</h1>
      <ul>
        {posts.map((post: any, idx: number) => (
          <li key={idx} style={{ marginBottom: 24 }}>
            <Link href={`/blog/${post.frontmatter.slug}`}>
              <strong>{post.frontmatter.title}</strong>
            </Link>
            <span style={{ marginLeft: 8, color: '#888' }}>
              {new Date(post.frontmatter.date).toLocaleDateString('es-ES')}
            </span>
            {post.frontmatter.description && (
              <p style={{ margin: '4px 0 0 0', color: '#555' }}>
                {post.frontmatter.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
