// Ensure the correct path and file exist for mdx.ts and getPost export
import { getPostSerialized } from '../../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export default async function BlogPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPostSerialized(params.slug);
  } catch (err) {
    return notFound();
  }
  const { source, frontmatter } = post;
  return (
    <main style={{ padding: 24 }}>
      <h1>{frontmatter.title}</h1>
      <p>{frontmatter.date}</p>
      <MDXRemote source={source} />
    </main>
  );
}
