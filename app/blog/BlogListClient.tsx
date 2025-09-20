<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/blog/BlogListClient.tsx

2025-09-13T06:20:07.361Z

——————————————————————————————
Archivo .tsx: BlogListClient.tsx
Tamaño: 7641 caracteres, 190 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import BlogCategories from '../../components/BlogCategories';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

export default function BlogListClient({
  posts,
  total,
  page,
  pageSize,
  categories,
  activeCategory,
  query,
  sort,
}: {
  posts: BlogCard[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  activeCategory: string;
  query: string;
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(query || '');
  const [sortValue, setSortValue] = useState(sort || 'date-desc');
  const [sizeValue, setSizeValue] = useState(String(pageSize || 9));

  useEffect(() => {
    setSearch(query || '');
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setParams = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams?.toString());
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === '') {sp.delete(k);}
      else {sp.set(k, v);}
    }
    if (!('page' in params)) {sp.set('page', '1');}
    router.push(`${pathname}?${sp.toString()}`);
  };

  const filteredPosts = posts; // server already applied filters

  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="w-full sm:w-auto">
          <BlogCategories
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={(cat) => setParams({ category: cat === 'Todas' ? undefined : cat })}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setParams({ q: search || undefined });
            }}
            className="w-full sm:w-80"
          >
            <input
              type="search"
              placeholder="Buscar artículos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-sm"
            />
          </form>
          <select
            value={sortValue}
            onChange={(e) => { setSortValue(e.target.value); setParams({ sort: e.target.value }); }}
            className="border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-2 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="date-desc">Más recientes</option>
            <option value="date-asc">Más antiguos</option>
            <option value="title-asc">Título A→Z</option>
            <option value="title-desc">Título Z→A</option>
          </select>
          <select
            value={sizeValue}
            onChange={(e) => { setSizeValue(e.target.value); setParams({ pageSize: e.target.value }); }}
            className="border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-2 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>
      </div>

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
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No hay artículos que coincidan con tu búsqueda</div>
          <button onClick={() => setParams({ category: undefined, q: undefined })} className="text-accent hover:text-accent-700 font-medium">
            Ver todos los artículos
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setParams({ page: String(Math.max(1, page - 1)) })}
            className={`px-3 py-2 rounded border text-sm ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">Página {page} de {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setParams({ page: String(Math.min(totalPages, page + 1)) })}
            className={`px-3 py-2 rounded border text-sm ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
