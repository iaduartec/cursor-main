import { db } from '../db/client';
import { posts } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
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

const hasDb = () => Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);

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

