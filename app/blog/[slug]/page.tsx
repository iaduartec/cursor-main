import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

import RelatedPosts from '../../../components/RelatedPosts';
import { getAllPosts, getAllSlugs, getPostBySlug } from '../../../lib/db-posts';
import { renderMarkdown } from '../../../lib/markdown';

const FALLBACK_IMAGE = '/images/proyectos/CCTV.jpeg';

const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const canonicalSlugFor = (p: { slug?: string | null; title?: string | null }): string => {
  const base = p.slug || p.title || '';
  return normalizeSlug(base);
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Seguridad':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'Electricidad':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Informática':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Sonido':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const estimateReadTime = (text: string) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

const cleanSrc = (value?: string | null) => (value || '').replace(/[\r\n]+/g, '').trim();

type BlogCard = {
  title: string;
  slug: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
};

const getBlogCards = unstable_cache(
  async (): Promise<BlogCard[]> => {
    const all = await getAllPosts();
    return all
      .map((post) => ({
        title: post.title,
        slug: canonicalSlugFor(post),
        category: post.category ?? 'General',
        image: cleanSrc(post.image) || FALLBACK_IMAGE,
        date: post.date.toISOString(),
        readTime: estimateReadTime(post.content || ''),
        excerpt: post.description || '',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  ['blog-cards-db-v1'],
  { revalidate: 3600, tags: ['blogs'] }
);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const incoming = normalizeSlug(params.slug);
  const post = await getPostBySlug(incoming);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.',
    };
  }

  const image = cleanSrc(post.image);

  return {
    title: `${post.title} - Duartec Blog`,
    description: post.description || undefined,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: image ? [image] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const incoming = normalizeSlug(params.slug);
  const post = await getPostBySlug(incoming);

  if (!post) {
    notFound();
  }

  const canonical = canonicalSlugFor(post);
  if (incoming !== canonical) {
    redirect(`/blog/${canonical}`);
  }

  const html = renderMarkdown(post.content || '');
  const readTime = estimateReadTime(post.content || '');

  const allPosts = await getBlogCards();

  const heroImage = cleanSrc(post.image) || FALLBACK_IMAGE;

  const current: BlogCard = {
    title: post.title,
    slug: canonicalSlugFor(post),
    category: post.category ?? 'General',
    image: heroImage,
    date: post.date.toISOString(),
    readTime,
    excerpt: post.description || '',
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={current.title}
            fill
            className="object-cover opacity-30"
            sizes="(min-width: 1024px) 1280px, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/60 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/70" />
        </div>

        <div className="relative max-w-4xl mx-auto text-slate-900 dark:text-white">
          <Link href="/blog" className="mb-8 inline-flex items-center text-accent hover:text-accent-700 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver al blog
          </Link>

          <div className="mb-6">
            <span className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${getCategoryColor(current.category)}`}>
              {current.category}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            {current.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span>
                {new Date(current.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              <span>{current.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        <RelatedPosts currentPost={current} allPosts={allPosts} maxPosts={3} />

        <div className="mt-16 rounded-2xl bg-accent p-8 text-center text-white">
          <h3 className="mb-4 text-2xl font-bold">¿Necesitas ayuda con tu proyecto?</h3>
          <p className="mb-6 text-lg opacity-90">
            Nuestros expertos están aquí para ayudarte con cualquier consulta técnica.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-accent transition-colors duration-200 hover:bg-gray-100"
            >
              Contactar expertos
            </Link>
            <a
              href="tel:+34947256430"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-accent"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
