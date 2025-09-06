'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import BlogCategories from '../../components/BlogCategories';

export type BlogCard = {
  title: string;
  slug: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
};

const getCategoryColor = (category: string) => {
  const c = (category || '').toLowerCase();
  if (c === 'seguridad' || c === 'security') {return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';}
  if (c === 'electricidad' || c === 'electricity') {return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';}
  if (c === 'informática' || c === 'informatica' || c === 'it') {return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';}
  if (c === 'sonido' || c === 'audio') {return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';}
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export default function BlogListClient({ posts }: { posts: BlogCard[] }) {
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [posts]);

  const filteredPosts = activeCategory === 'Todas' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <BlogCategories categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-slate-700"
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>{post.category}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold mb-3 text-primary dark:text-white line-clamp-2">{post.title}</h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-accent hover:text-accent-700 font-medium transition-colors">
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
          <button onClick={() => setActiveCategory('Todas')} className="text-accent hover:text-accent-700 font-medium">
            Ver todos los artículos
          </button>
        </div>
      )}
    </section>
  );
}

