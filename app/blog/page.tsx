import Breadcrumb from '../../components/Breadcrumb';
import BlogListClient, { type BlogCard } from './BlogListClient';
import { getAllPosts } from '../../lib/db-posts';

const cleanSrc = (s?: string) => (s || '').replace(/[\r\n]+/g, '').trim();
const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const canonicalSlugFor = (p: Blog): string => {
  const raw = (p as any)?._raw?.flattenedPath as string | undefined;
  const base = p.slug || (raw ? (raw.split('/').pop() || raw) : p.title);
  return normalizeSlug(base);
};
const estimateReadTime = (text: string) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

export default async function BlogPage() {
  const dbPosts = await getAllPosts();
  const posts: BlogCard[] = dbPosts
    .map((p) => ({
      title: p.title,
      slug: normalizeSlug(p.slug),
      category: p.category ?? 'General',
      image: cleanSrc(p.image || '') || '/images/proyectos/CCTV.jpeg',
      date: p.date.toISOString(),
      readTime: estimateReadTime(p.content || ''),
      excerpt: p.description || '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

      <BlogListClient posts={posts} />
    </div>
  );
}
