/**
Resumen generado automáticamente.

intranet-scaffold/app/blog/[slug]/page.tsx

2025-09-13T06:20:07.374Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 625 caracteres, 22 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// Ensure the correct path and file exist for mdx.ts and getPost export
import { getPostSerialized } from '../../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await getPostSerialized(params.slug);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return notFound();
  }
  const { source, frontmatter } = post;
  return (
    <main style={{ padding: 24 }}>
      <h1>{frontmatter.title}</h1>
      <p>{new Date(frontmatter.date).toLocaleDateString('es-ES')}</p>
      <MDXRemote source={source} />
    </main>
  );
}
