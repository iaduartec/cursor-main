import { db } from '../db/client';
import { posts } from '../db/schema';
import { and, asc, count, desc, eq, ilike, or, SQL } from 'drizzle-orm';
import type { Blog } from 'contentlayer/generated';
import { allBlogs } from 'contentlayer/generated';

export type PostRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  image: string | null;
  date: Date;
  published: boolean;
};

const hasDb = () =>
  Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL
  );

export async function getAllPostsFromDb(): Promise<PostRow[]> {
  if (!hasDb()) return [];
  try {
    const rows = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        content: posts.content,
        category: posts.category,
        image: posts.image,
        date: posts.date,
        published: posts.published,
      })
      .from(posts)
      .orderBy(desc(posts.date));

    // Drizzle may return date as Date
    return rows as unknown as PostRow[];
  } catch (e) {
    console.error('DB getAllPostsFromDb error', e);
    return [];
  }
}

export async function getPostBySlugFromDb(slug: string): Promise<PostRow | null> {
  if (!hasDb()) return null;
  try {
    const [row] = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        content: posts.content,
        category: posts.category,
        image: posts.image,
        date: posts.date,
        published: posts.published,
      })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);
    return (row as unknown as PostRow) || null;
  } catch (e) {
    console.error('DB getPostBySlugFromDb error', e);
    return null;
  }
}

export async function getAllSlugsFromDb(): Promise<string[]> {
  if (!hasDb()) return [];
  try {
    const rows = await db.select({ slug: posts.slug }).from(posts);
    return rows.map((r) => r.slug);
  } catch (e) {
    console.error('DB getAllSlugsFromDb error', e);
    return [];
  }
}

export type PostsPageParams = {
  page?: number;
  pageSize?: number;
  category?: string | null;
  q?: string | null;
  sortBy?: 'date' | 'title';
  sortDir?: 'asc' | 'desc';
};

export async function getPostsPageFromDb(
  { page = 1, pageSize = 9, category, q, sortBy = 'date', sortDir = 'desc' }: PostsPageParams
): Promise<{ items: PostRow[]; total: number; page: number; pageSize: number }> {
  if (!hasDb()) return { items: [], total: 0, page, pageSize };
  const offset = Math.max(0, (page - 1) * pageSize);

  const conds: SQL[] = [];
  if (category && category !== 'Todas') conds.push(eq(posts.category, category));
  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    conds.push(
      or(
        ilike(posts.title, like) as any,
        ilike(posts.description as any, like as any) as any,
        ilike(posts.content, like) as any
      ) as any
    );
  }
  const where = conds.length > 0 ? and(...conds) : undefined;

  // total count
  let total = 0;
  try {
    let countQ: any = db.select({ value: count() }).from(posts);
    if (where) countQ = countQ.where(where as any);
    const countRows = await countQ;
    total = Number(countRows?.[0]?.value ?? 0);
  } catch (e) {
    console.error('DB count error', e);
  }

  // page items
  try {
    let qsel: any = db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        content: posts.content,
        category: posts.category,
        image: posts.image,
        date: posts.date,
        published: posts.published,
      })
      .from(posts)
      .orderBy(
        sortBy === 'title'
          ? (sortDir === 'asc' ? asc(posts.title) : desc(posts.title))
          : (sortDir === 'asc' ? asc(posts.date) : desc(posts.date))
      )
      .limit(pageSize)
      .offset(offset);
    if (where) qsel = qsel.where(where as any);
    const rows = await qsel;
    return { items: rows as unknown as PostRow[], total, page, pageSize };
  } catch (e) {
    console.error('DB page error', e);
    return { items: [], total, page, pageSize };
  }
}

export async function getDistinctCategoriesFromDb(): Promise<string[]> {
  if (!hasDb()) return [];
  try {
    // group by to get distinct categories
    const rows = await db.select({ category: posts.category }).from(posts).groupBy(posts.category);
    return rows.map((r) => r.category).filter((x): x is string => !!x);
  } catch (e) {
    console.error('DB categories error', e);
    return [];
  }
}

// Fallbacks using Contentlayer (for local/dev without DB)
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

export async function getAllPosts(): Promise<PostRow[]> {
  const dbRows = await getAllPostsFromDb();
  if (dbRows.length > 0) return dbRows;
  // Fallback to Contentlayer
  return allBlogs.map((p) => ({
    id: 0,
    slug: canonicalSlugFor(p),
    title: p.title,
    description: p.description ?? null,
    content: (p as any)?.body?.raw ?? '',
    category: p.category ?? null,
    image: p.image ?? null,
    date: new Date(p.date),
    published: true,
  }));
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const norm = normalizeSlug(slug);
  const row = await getPostBySlugFromDb(norm);
  if (row) return row;
  const p = allBlogs.find((x) => canonicalSlugFor(x) === norm);
  if (!p) return null;
  return {
    id: 0,
    slug: canonicalSlugFor(p),
    title: p.title,
    description: p.description ?? null,
    content: (p as any)?.body?.raw ?? '',
    category: p.category ?? null,
    image: p.image ?? null,
    date: new Date(p.date),
    published: true,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const slugs = await getAllSlugsFromDb();
  if (slugs.length > 0) return slugs.map(normalizeSlug);
  return allBlogs.map((p) => canonicalSlugFor(p));
}

export async function getPostsPage(params: PostsPageParams): Promise<{ items: PostRow[]; total: number; page: number; pageSize: number }>{
  const dbResult = await getPostsPageFromDb(params);
  if (dbResult.items.length > 0 || hasDb()) {
    return dbResult;
  }
  // Fallback emulate pagination with contentlayer
  const all = await getAllPosts();
  const category = params.category && params.category !== 'Todas' ? params.category : undefined;
  const q = params.q?.trim();
  let filtered = all;
  if (category) filtered = filtered.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());
  if (q && q.length > 0) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(needle) || (p.description || '').toLowerCase().includes(needle) || (p.content || '').toLowerCase().includes(needle)
    );
  }
  const sortBy = params.sortBy || 'date';
  const sortDir = params.sortDir || 'desc';
  filtered = filtered.sort((a, b) => {
    if (sortBy === 'title') {
      const cmp = a.title.localeCompare(b.title);
      return sortDir === 'asc' ? cmp : -cmp;
    }
    const cmp = a.date.getTime() - b.date.getTime();
    return sortDir === 'asc' ? cmp : -cmp;
  });
  const page = params.page || 1;
  const pageSize = params.pageSize || 9;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total: filtered.length, page, pageSize };
}

export async function getDistinctCategories(): Promise<string[]> {
  const cats = await getDistinctCategoriesFromDb();
  if (cats.length > 0 || hasDb()) return cats;
  const set = new Set<string>();
  for (const p of allBlogs) {
    if (p.category) set.add(p.category);
  }
  return Array.from(set);
}
