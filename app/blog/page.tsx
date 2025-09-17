/**
Resumen generado automáticamente.

app/blog/page.tsx

2025-09-13T06:20:07.362Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 3551 caracteres, 87 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import Breadcrumb from '../../components/Breadcrumb';
import BlogListClient, { type BlogCard } from './BlogListClient';
import { getPostsPage, getDistinctCategories } from '../../lib/db-posts';

const cleanSrc = (s?: string) => (s || '').replace(/[\r\n]+/g, '').trim();
const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const estimateReadTime = (text: string) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pageParam = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const categoryParam = Array.isArray(sp?.category) ? sp?.category[0] : sp?.category;
  const queryParam = Array.isArray(sp?.q) ? sp?.q[0] : sp?.q;

  const page = Math.max(1, parseInt(String(pageParam || '1'), 10) || 1);
  const pageSizeParam = Array.isArray(sp?.pageSize) ? sp?.pageSize[0] : sp?.pageSize;
  const allowedSizes = [6, 9, 12, 18];
  let pageSize = parseInt(String(pageSizeParam || '9'), 10);
  if (!allowedSizes.includes(pageSize)) {pageSize = 9;}
  const sortParam = Array.isArray(sp?.sort) ? sp?.sort[0] : sp?.sort;
  let sortBy: 'date' | 'title' = 'date';
  let sortDir: 'asc' | 'desc' = 'desc';
  if (sortParam) {
    if (sortParam === 'date-asc') { sortBy = 'date'; sortDir = 'asc'; }
    if (sortParam === 'date-desc') { sortBy = 'date'; sortDir = 'desc'; }
    if (sortParam === 'title-asc') { sortBy = 'title'; sortDir = 'asc'; }
    if (sortParam === 'title-desc') { sortBy = 'title'; sortDir = 'desc'; }
  }
  const activeCategory = categoryParam || 'Todas';
  const query = queryParam ? String(queryParam) : '';

  const { items, total } = await getPostsPage({ page, pageSize, category: activeCategory, q: query, sortBy, sortDir });
  const posts: BlogCard[] = items.map((p) => ({
    title: p.title,
    slug: normalizeSlug(p.slug),
    category: p.category ?? 'General',
    image: cleanSrc(p.image || '') || '/images/proyectos/CCTV.jpeg',
    date: new Date(p.publishedAt).toISOString(),
    readTime: estimateReadTime(p.content || ''),
    excerpt: p.description || '',
  }));

  const cats = await getDistinctCategories();
  const categories = cats.length > 0 ? cats : Array.from(new Set(posts.map((p) => p.category))).filter(Boolean) as string[];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[{ label: 'Blog', href: '/blog' }]} />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">Blog Técnico</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Artículos técnicos sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias.
            </p>
          </div>
        </div>
      </section>

      <BlogListClient
        posts={posts}
        total={total}
        page={page}
        pageSize={pageSize}
        categories={categories}
        activeCategory={activeCategory}
        query={query}
        sort={`${sortBy}-${sortDir}`}
      />
    </div>
  );
}
