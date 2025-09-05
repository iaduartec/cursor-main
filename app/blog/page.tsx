'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import BlogCategories from '../../components/BlogCategories';
import { allBlogs, type Blog } from 'contentlayer/generated';
import { useMemo, useState } from 'react';

// Color por categoría (español + sin tildes)
const getCategoryColor = (category: string) => {
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

type BlogCard = {
  title: string;
  slug: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
};

const estimateReadTime = (text: string) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todas');

  const allPosts: BlogCard[] = useMemo(() => {
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
  }, []);

  const filteredPosts = activeCategory === 'Todas'
    ? allPosts
    : allPosts.filter(post => post.category === activeCategory);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach(p => set.add(p.category));
    return Array.from(set);
  }, [allPosts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[{ label: 'Blog', href: '/blog' }]} />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
              Blog Técnico
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. 
              Consejos profesionales y tendencias del sector para mantenerte actualizado.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <BlogCategories 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
                {/* Imagen del artículo */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {/* Categoría */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Contenido del artículo */}
                <div className="p-6">
                  {/* Metadatos */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Título */}
                  <h2 className="text-xl font-bold mb-3 text-primary dark:text-white line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Extracto */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Botón de lectura */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-accent hover:text-accent-700 font-medium transition-colors"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No hay artículos en la categoría &quot;{activeCategory}&quot;
            </div>
            <button
              onClick={() => setActiveCategory('Todas')}
              className="text-accent hover:text-accent-700 font-medium"
            >
              Ver todos los artículos
            </button>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-20 bg-gradient-to-r from-accent to-accent-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            ¿Quieres recibir nuestros artículos?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Suscríbete para recibir las últimas novedades técnicas y consejos profesionales directamente en tu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="px-4 py-3 rounded-lg text-gray-900 flex-1"
            />
            <button className="px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

