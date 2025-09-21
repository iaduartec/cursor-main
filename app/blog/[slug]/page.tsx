import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

import Breadcrumb from '../../../components/Breadcrumb';
import RelatedPosts from '../../../components/RelatedPosts';
import { getAllPosts, getAllSlugs, getPostBySlug } from '../../../lib/db-posts';
import { renderMarkdown } from '../../../lib/markdown';

const FALLBACK_IMAGE = '/images/proyectos/CCTV.jpeg';

const normalizeSlug = (slug: string): string =>
  String(slug || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const canonicalSlugFor = (post: { slug?: string | null; title?: string | null }): string => {
  const base = post.slug || post.title || '';
  return normalizeSlug(base);
};

const cleanSrc = (value?: string | null): string => (value || '').replace(/[\r\n]+/g, '').trim();

const getCategoryColor = (category: string) => {
  switch ((category || '').toLowerCase()) {
    case 'seguridad':
    case 'security':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'electricidad':
    case 'electricity':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'informática':
    case 'informatica':
    case 'it':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'sonido':
    case 'audio':
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
    const posts = await getAllPosts();
    return posts
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

  return {
    title: `${post.title} - Duartec Blog`,
    description: post.description || undefined,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: cleanSrc(post.image) ? [cleanSrc(post.image)] : [],
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

  const current: BlogCard = {
    title: post.title,
    slug: canonical,
    category: post.category ?? 'General',
    image: cleanSrc(post.image) || FALLBACK_IMAGE,
    date: post.date.toISOString(),
    readTime,
    excerpt: post.description || '',
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={current.image || FALLBACK_IMAGE}
            alt={current.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al blog
          </Link>

          <div className="mb-4">
            <span className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${getCategoryColor(current.category)}`}>
              {current.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{current.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
            <span className="inline-flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(current.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {current.readTime} de lectura
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-4">
        <Breadcrumb
          items={[
            { label: 'Blog', href: '/blog' },
            { label: current.title },
          ]}
        />

        <article className="prose prose-lg max-w-none dark:prose-invert">
          {/* eslint-disable-next-line react/no-danger */}
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
