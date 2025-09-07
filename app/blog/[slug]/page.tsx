import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import Breadcrumb from '../../../components/Breadcrumb';
import RelatedPosts from '../../../components/RelatedPosts';
import { unstable_cache } from 'next/cache';
import { getAllPosts, getAllSlugs, getPostBySlug } from '../../../lib/db-posts';
import { marked } from 'marked';

const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const canonicalSlugFor = (p: { slug?: string; title?: string }): string => {
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const incoming = normalizeSlug(slug);
  const post = await getPostBySlug(incoming);
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.'
    };
  }

  return {
    title: `${post.title} - Duartec Blog`,
    description: post.description || undefined,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: post.image ? [cleanSrc(post.image)] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type BlogCard = {
  title: string;
  slug: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
};

const cleanSrc = (s?: string) => (s || '').replace(/[\r\n]+/g, '').trim();

const getBlogCards = unstable_cache(
  async (): Promise<{
    title: string;
    slug: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    excerpt: string;
  }[]> => {
    const all = await getAllPosts();
    return all
      .map((p) => ({
        title: p.title,
        slug: canonicalSlugFor(p),
        category: p.category ?? 'General',
        image: cleanSrc(p.image || '') || '/images/proyectos/CCTV.jpeg',
        date: p.date.toISOString(),
        readTime: estimateReadTime(p.content || ''),
        excerpt: p.description || '',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  ['blog-cards-db-v1'],
  { revalidate: 3600, tags: ['blogs'] }
);

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const incoming = normalizeSlug(slug);
  const post = await getPostBySlug(incoming);
  if (!post) {
    notFound();
  }
  const canonical = canonicalSlugFor(post);
  if (slug !== canonical) {
    redirect(`/blog/${canonical}`);
  }

  const html = (await marked.parse(post.content || '')) as string;
  const readTime = estimateReadTime(post.content || '');

  const allPosts: BlogCard[] = await getBlogCards();

  const current: BlogCard = {
    title: post.title,
    slug: canonicalSlugFor(post),
    category: post.category ?? 'General',
    image: post.image || '/images/proyectos/CCTV.jpeg',
    date: post.date.toISOString(),
    readTime,
    excerpt: post.description || '',
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={current.image || '/images/proyectos/CCTV.jpeg'}
            alt={current.title}
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <Breadcrumb items={[
            { label: 'Blog', href: '/blog' },
            { label: current.title }
          ]} />

          <div className="flex items-center mb-6">
            <Link
              href="/blog"
              className="flex items-center text-accent hover:text-accent-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al blog
            </Link>
          </div>

          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor((current.category || '') )}`}>
              {current.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
            {current.title}
          </h1>

          <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(current.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{current.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-4">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        <RelatedPosts
          currentPost={current}
          allPosts={allPosts}
          maxPosts={3}
        />

        <div className="mt-16 bg-accent rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            ¿Necesitas ayuda con tu proyecto?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Nuestros expertos están aquí para ayudarte con cualquier consulta técnica
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contactar expertos
            </Link>
            <a
              href="tel:+34947256430"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors duration-200"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

