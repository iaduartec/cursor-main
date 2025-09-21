import { notFound } from 'next/navigation';
import { getBlogBySlug } from '../../../lib/db-blog';
import { BlogLayout } from '../layout';

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) return notFound();
  return <BlogLayout blog={blog} />;
}
<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/blog/[slug]/page.tsx

2025-09-13T06:20:07.361Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 7543 caracteres, 231 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
<<<<<<< HEAD
import { notFound, redirect } from 'next/navigation';
import Breadcrumb from '../../../components/Breadcrumb';
import RelatedPosts from '../../../components/RelatedPosts';
import { unstable_cache } from 'next/cache';
import { getAllPosts, getAllSlugs, getPostBySlug } from '../../../lib/db-posts';
import { marked } from 'marked';
=======
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '../../../lib/db-posts';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

<<<<<<< HEAD
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

=======
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
const estimateReadTime = (text: string) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
<<<<<<< HEAD
  const incoming = normalizeSlug(slug);
  const post = await getPostBySlug(incoming);
=======
  const normalizedSlug = normalizeSlug(slug);
  const post = await getPostBySlug(normalizedSlug);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.'
    };
  }

  return {
    title: `${post.title} - Duartec Blog`,
    description: post.description || undefined,
<<<<<<< HEAD
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: post.image ? [cleanSrc(post.image)] : [],
    },
=======
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  };
}

export async function generateStaticParams() {
<<<<<<< HEAD
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
=======
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const post = await getPostBySlug(normalizedSlug);

  if (!post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content || '');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.image || '/images/proyectos/CCTV.jpeg'}
            alt={post.title}
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
<<<<<<< HEAD
          <Breadcrumb items={[
            { label: 'Blog', href: '/blog' },
            { label: current.title }
          ]} />
=======
          {/* Breadcrumb simple */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{post.title}</span>
          </nav>
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

          <div className="flex items-center mb-6">
            <Link
              href="/blog"
<<<<<<< HEAD
              className="flex items-center text-accent hover:text-accent-700 transition-colors"
=======
              className="flex items-center text-accent hover:text-accent/80 transition-colors"
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al blog
            </Link>
          </div>

          <div className="mb-6">
<<<<<<< HEAD
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor((current.category || '') )}`}>
              {current.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
            {current.title}
=======
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            {post.title}
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
          </h1>

          <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
<<<<<<< HEAD
              <span>{new Date(current.date).toLocaleDateString('es-ES', {
=======
              <span>{new Date(post.publishedAt).toLocaleDateString('es-ES', {
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
<<<<<<< HEAD
              <span>{current.readTime} de lectura</span>
=======
              <span>{readTime} de lectura</span>
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section className="max-w-4xl mx-auto py-16 px-4">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        <RelatedPosts
          currentPost={current}
          allPosts={allPosts}
          maxPosts={3}
        />

=======
      {/* Content Section */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </article>

        {/* Call to Action */}
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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
<<<<<<< HEAD
              className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
=======
              className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
            >
              Contactar expertos
            </Link>
            <a
              href="tel:+34947256430"
<<<<<<< HEAD
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors duration-200"
=======
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors"
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

