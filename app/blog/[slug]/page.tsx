import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import Breadcrumb from '../../../components/Breadcrumb';
import RelatedPosts from '../../../components/RelatedPosts';
import { allBlogs, type Blog } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { unstable_cache } from 'next/cache';

// Color por categoría
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

// Versión robusta de colores por categoría
const getCategoryColor2 = (category: string) => {
  const c = (category || '').toLowerCase();
  if (c === 'seguridad' || c === 'security') {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
  if (c === 'electricidad' || c === 'electricity') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  }
  if (c === 'informática' || c === 'informatica' || c === 'it') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
  if (c === 'sonido' || c === 'audio') {
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

const estimateReadTime = (text: string) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.'
    };
  }

  return {
    title: `${post.title} - Duartec Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
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
    return allBlogs
      .map((p: Blog) => ({
        title: p.title,
        slug: p.slug,
        category: p.category ?? 'General',
        image: p.image ?? '/images/proyectos/CCTV.jpeg',
        date: p.date,
        readTime: estimateReadTime(p.body?.raw ?? ''),
        excerpt: p.description,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  ['blog-cards-v1'],
  { revalidate: 3600, tags: ['blogs'] }
);

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  // Contentlayer typing marks body as Markdown in some setups; cast to access compiled MDX
  const MDXContent = useMDXComponent((post as any).body.code);
  const mdxComponents = {
    a: (props: any) => (
      <a {...props} className={`text-accent hover:text-accent-700 underline ${props.className || ''}`} />
    ),
    img: (props: any) => (
      <Image
        src={props.src}
        alt={props.alt || ''}
        width={1200}
        height={675}
        className={`rounded-xl my-6 ${props.className || ''}`}
      />
    ),
  };
  const readTime = estimateReadTime((post as any).body.raw ?? '');

  const allPosts: BlogCard[] = await getBlogCards();

  const current: BlogCard = {
    title: post!.title,
    slug: post!.slug,
    category: post!.category ?? 'General',
    image: post!.image ?? '/images/proyectos/CCTV.jpeg',
    date: post!.date,
    readTime,
    excerpt: post!.description,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={(current.image) || '/images/proyectos/CCTV.jpeg'}
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
          
          {/* Categoría */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor((current.category || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace('IT','Informática'))}`}>
              {current.category}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
            {current.title}
          </h1>

          {/* Metadatos */}
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

      {/* Contenido del artículo */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent components={mdxComponents} />
        </article>

        {/* Artículos relacionados */}
        <RelatedPosts 
          currentPost={current}
          allPosts={allPosts}
          maxPosts={3}
        />

        {/* CTA Section */}
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
