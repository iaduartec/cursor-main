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
  };
}

export async function getAllSlugs(): Promise<string[]> {
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
}
