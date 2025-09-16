/**
 * lib/db-posts.ts
 *
 * Lightweight data access helpers for posts. This file prefers the DB when
 * available, but falls back to Contentlayer (`allBlogs`) for local/dev and
 * static generation scenarios.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, type DrizzleClient } from '../db/client';
import { posts, type Post } from '../db/schema';
import { and, asc, count, desc, eq, ilike, or, SQL } from 'drizzle-orm';
import { allBlogs, type Blog } from 'contentlayer/generated';

// Use the Post type inferred from the Drizzle schema

const hasDb = () => {
  if (process.env.USE_IN_MEMORY_DB === '1' || process.env.SKIP_DB === '1') {
    return false;
  }
  return Boolean(
    process.env.SUPABASE_DB_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL
  );
};

// Helper type for contentlayer items where we access private/raw fields
type BlogRaw = Blog & {
  _raw?: { flattenedPath?: string } | undefined;
  body?: { raw?: string } | undefined;
};

// The `db` export in db/client.ts may be a typed drizzle instance or a
// lightweight fake (when DB is skipped). Cast locally to DrizzleClient to
// progressively migrate away from `any` while keeping runtime behavior.
const drizzleDb = db as unknown as DrizzleClient;

export async function getAllPostsFromDb(): Promise<Post[]> {
  if (!hasDb()) {
    return [];
  }
  try {
    const rows = await drizzleDb
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

    return rows as unknown as Post[];
  } catch (e) {
    console.error('DB getAllPostsFromDb error', e);
    return [];
  }
}

export async function getPostBySlugFromDb(slug: string): Promise<Post | null> {
  if (!hasDb()) {
    return null;
  }
  try {
    const [row] = await drizzleDb
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
    return (row as unknown as Post) || null;
  } catch (e) {
    console.error('DB getPostBySlugFromDb error', e);
    return null;
  }
}

export async function getAllSlugsFromDb(): Promise<string[]> {
  if (!hasDb()) {
    return [];
  }
  try {
    const rows: Array<{ slug: string }> = await drizzleDb
      .select({ slug: posts.slug })
      .from(posts);
    return rows.map(r => r.slug);
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

export async function getPostsPageFromDb({
  page = 1,
  pageSize = 9,
  category,
  q,
  sortBy = 'date',
  sortDir = 'desc',
}: PostsPageParams): Promise<{
  items: Post[];
  total: number;
  page: number;
  pageSize: number;
}> {
  if (!hasDb()) {
    return { items: [], total: 0, page, pageSize };
  }
  const offset = Math.max(0, (page - 1) * pageSize);

  const conds: SQL[] = [];
  if (category && category !== 'Todas') {
    conds.push(eq(posts.category, category));
  }
  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    const pred = or(
      ilike(posts.title as unknown as SQL, like as string),
      ilike(posts.description as unknown as SQL, like as string),
      ilike(posts.content as unknown as SQL, like as string)
    );
    conds.push(pred as unknown as SQL);
  }
  const where = conds.length > 0 ? and(...conds) : undefined;

  // total count
  let total = 0;
  try {
    let countQ: any = drizzleDb.select({ value: count() }).from(posts);
    if (where) {
      countQ = countQ.where(where as unknown as SQL);
    }
    const countRows: Array<{ value: number }> = await countQ;
    total = Number((countRows?.[0]?.value ?? 0) as number);
  } catch (e) {
    console.error('DB count error', e);
  }

  // page items
  try {
    let qsel: any = drizzleDb
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
          ? sortDir === 'asc'
            ? asc(posts.title)
            : desc(posts.title)
          : sortDir === 'asc'
            ? asc(posts.date)
            : desc(posts.date)
      )
      .limit(pageSize)
      .offset(offset);
    if (where) {
      qsel = qsel.where(where as unknown as SQL);
    }
    const rows: Post[] = await qsel;
    return { items: rows, total, page, pageSize };
  } catch (e) {
    console.error('DB page error', e);
    return { items: [], total, page, pageSize };
  }
}

export async function getDistinctCategoriesFromDb(): Promise<string[]> {
  if (!hasDb()) {
    return [];
  }
  try {
    // group by to get distinct categories
    const rows: Array<{ category: string | null }> = await drizzleDb
      .select({ category: posts.category })
      .from(posts)
      .groupBy(posts.category);
    return rows.map(r => r.category).filter((x): x is string => !!x);
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
    // remove common combining diacritical marks after NFD normalization
    .replace(/[\u0300-\u036f]/g, '') // remove combining diacritical marks
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric characters with '-'
    .replace(/^-+|-+$/g, ''); // trim leading and trailing '-'

const canonicalSlugFor = (p: Blog): string => {
  const raw = (p as BlogRaw)._raw?.flattenedPath as string | undefined;
  const base = p.slug || (raw ? raw.split('/').pop() || raw : p.title);
  return normalizeSlug(base);
};

export async function getAllPosts(): Promise<Post[]> {
  const dbRows = await getAllPostsFromDb();
  if (dbRows.length > 0) {
    return dbRows;
  }
  // Fallback to Contentlayer
  return allBlogs.map(p => ({
    id: 0,
    slug: canonicalSlugFor(p),
    title: p.title,
    description: p.description ?? null,
    content: (p as BlogRaw).body?.raw ?? '',
    category: p.category ?? null,
    image: p.image ?? null,
    date: new Date(p.date),
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const norm = normalizeSlug(slug);
  const row = await getPostBySlugFromDb(norm);
  if (row) {
    return row;
  }
  const p = allBlogs.find(x => canonicalSlugFor(x) === norm);
  if (!p) {
    return null;
  }
  return {
    id: 0,
    slug: canonicalSlugFor(p),
    title: p.title,
    description: p.description ?? null,
    content: (p as BlogRaw).body?.raw ?? '',
    category: p.category ?? null,
    image: p.image ?? null,
    date: new Date(p.date),
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const slugs = await getAllSlugsFromDb();
  if (slugs.length > 0) {
    return slugs.map(normalizeSlug);
  }
  return allBlogs.map(p => canonicalSlugFor(p));
}

export async function getPostsPage(
  params: PostsPageParams
): Promise<{ items: Post[]; total: number; page: number; pageSize: number }> {
  const dbResult = await getPostsPageFromDb(params);
  // If DB has items and is configured, prefer DB results.
  if (hasDb() && dbResult.items.length > 0) {
    return dbResult;
  }

  // Otherwise, try to fallback to Contentlayer (local MDX files).
  const all = await getAllPosts();
  if (!all || all.length === 0) {
    return dbResult;
  }
  const category =
    params.category && params.category !== 'Todas'
      ? params.category
      : undefined;
  const q = params.q?.trim();
  let filtered = all;
  if (category) {
    filtered = filtered.filter(
      p => (p.category || '').toLowerCase() === category.toLowerCase()
    );
  }
  if (q && q.length > 0) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.title.toLowerCase().includes(needle) ||
        (p.description || '').toLowerCase().includes(needle) ||
        (p.content || '').toLowerCase().includes(needle)
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
  if (cats.length > 0 || hasDb()) {
    return cats;
  }
  const set = new Set<string>();
  for (const p of allBlogs) {
    if (p.category) {
      set.add(p.category);
    }
  }
  return Array.from(set);
}
