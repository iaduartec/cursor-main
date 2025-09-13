import { getPost } from '../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export default async function BlogPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPost(params.slug);
  } catch {
    return notFound();
  }
  const { content, frontmatter } = post;
  return (
    <main style={{ padding: 24 }}>
      <h1>{frontmatter.title}</h1>
      <p>{frontmatter.date}</p>
      <MDXRemote source={content} />
    </main>
  );
}
