<<<<<<< HEAD
import { db } from '../db/client';
import { posts } from '../db/schema';
import { and, asc, count, desc, eq, ilike, or, SQL } from 'drizzle-orm';
import { allBlogs, type Blog } from 'contentlayer/generated';

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

const hasDb = () => Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL);

export async function getAllPostsFromDb(): Promise<PostRow[]> {
  if (!hasDb()) {return [];}
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
  if (!hasDb()) {return null;}
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
  if (!hasDb()) {return [];}
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
  if (!hasDb()) {return { items: [], total: 0, page, pageSize };}
  const offset = Math.max(0, (page - 1) * pageSize);

  const conds: SQL[] = [];
  if (category && category !== 'Todas') {conds.push(eq(posts.category, category));}
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
    if (where) {countQ = countQ.where(where as any);}
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
    if (where) {qsel = qsel.where(where as any);}
    const rows = await qsel;
    return { items: rows as unknown as PostRow[], total, page, pageSize };
  } catch (e) {
    console.error('DB page error', e);
    return { items: [], total, page, pageSize };
  }
}

export async function getDistinctCategoriesFromDb(): Promise<string[]> {
  if (!hasDb()) {return [];}
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
  if (dbRows.length > 0) {return dbRows;}
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
  if (row) {return row;}
  const p = allBlogs.find((x) => canonicalSlugFor(x) === norm);
  if (!p) {return null;}
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
=======
// Fallback data when Contentlayer is disabled
const fallbackPosts = [
  {
    id: 1,
    slug: 'bienvenido-duartec',
    title: 'Bienvenido a Duartec - Tus expertos en instalaciones informáticas',
    description:
      'Conoce a Duartec, empresa líder en Burgos especializada en instalaciones informáticas, videovigilancia, sonido y electricidad.',
    content:
      'Somos Duartec, una empresa con más de 10 años de experiencia en el sector de las instalaciones informáticas y tecnológicas en Burgos y Castilla y León.',
    image: '/images/proyectos/Informática.jpeg',
    category: 'empresa',
    tags: ['duartec', 'burgos', 'instalaciones'],
    published: true,
    publishedAt: '2024-01-01T00:00:00.000Z',
    author: 'Duartec Team',
    readingTime: 3,
  },
  {
    id: 2,
    slug: 'importancia-videovigilancia-empresas',
    title: 'La importancia de la videovigilancia en las empresas modernas',
    description:
      'Descubre por qué la videovigilancia es fundamental para la seguridad de tu empresa y cómo elegir el sistema adecuado.',
    content:
      'En el mundo empresarial actual, la seguridad es una prioridad absoluta. La videovigilancia juega un papel crucial en la protección de activos, empleados y clientes.',
    image: '/images/proyectos/CCTV.jpeg',
    category: 'seguridad',
    tags: ['videovigilancia', 'seguridad', 'empresas'],
    published: true,
    publishedAt: '2024-01-15T00:00:00.000Z',
    author: 'Duartec Team',
    readingTime: 5,
  },
];

export type Post = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  author: string;
  readingTime: number;
};

export async function getAllPosts(): Promise<Post[]> {
  // Return fallback data when Contentlayer is disabled
  return fallbackPosts.filter(post => post.published);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.category === category);
}

export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}
export async function getPostsPage(options: {
  page: number;
  pageSize: number;
  category?: string;
  q?: string;
  sortBy?: 'date' | 'title';
  sortDir?: 'asc' | 'desc';
}): Promise<{ items: Post[]; total: number }> {
  let posts = await getAllPosts();

  // Filtrar por categoría
  if (options.category && options.category !== 'Todas') {
    posts = posts.filter(post => post.category === options.category);
  }

  // Filtrar por búsqueda
  if (options.q) {
    const query = options.q.toLowerCase();
    posts = posts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
  }

  // Ordenar
  const sortBy = options.sortBy || 'date';
  const sortDir = options.sortDir || 'desc';

  posts.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortBy === 'date') {
      aValue = new Date(a.publishedAt).getTime();
      bValue = new Date(b.publishedAt).getTime();
    } else {
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
    }

    if (sortDir === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Paginación
  const startIndex = (options.page - 1) * options.pageSize;
  const endIndex = startIndex + options.pageSize;
  const items = posts.slice(startIndex, endIndex);

  return {
    items,
    total: posts.length,
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  };
}

export async function getAllSlugs(): Promise<string[]> {
<<<<<<< HEAD
  const slugs = await getAllSlugsFromDb();
  if (slugs.length > 0) {return slugs.map(normalizeSlug);}
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
  if (category) {filtered = filtered.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());}
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
  if (cats.length > 0 || hasDb()) {return cats;}
  const set = new Set<string>();
  for (const p of allBlogs) {
    if (p.category) {set.add(p.category);}
  }
  return Array.from(set);
=======
  const posts = await getAllPosts();
  return posts.map(post => post.slug);
}

export async function getDistinctCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = [...new Set(posts.map(post => post.category))];
  return categories;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(
    post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.description.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery)
  );
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
}
