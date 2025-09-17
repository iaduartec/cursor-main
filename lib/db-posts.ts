// Fallback data when Contentlayer is disabled
const fallbackPosts = [
  {
    id: 1,
    slug: 'bienvenido-duartec',
    title: 'Bienvenido a Duartec - Tus expertos en instalaciones informáticas',
    description: 'Conoce a Duartec, empresa líder en Burgos especializada en instalaciones informáticas, videovigilancia, sonido y electricidad.',
    content: 'Somos Duartec, una empresa con más de 10 años de experiencia en el sector de las instalaciones informáticas y tecnológicas en Burgos y Castilla y León.',
    image: '/images/blog/bienvenido.jpg',
    category: 'empresa',
    tags: ['duartec', 'burgos', 'instalaciones'],
    published: true,
    publishedAt: '2024-01-01T00:00:00.000Z',
    author: 'Duartec Team',
    readingTime: 3
  },
  {
    id: 2,
    slug: 'importancia-videovigilancia-empresas',
    title: 'La importancia de la videovigilancia en las empresas modernas',
    description: 'Descubre por qué la videovigilancia es fundamental para la seguridad de tu empresa y cómo elegir el sistema adecuado.',
    content: 'En el mundo empresarial actual, la seguridad es una prioridad absoluta. La videovigilancia juega un papel crucial en la protección de activos, empleados y clientes.',
    image: '/images/blog/videovigilancia.jpg',
    category: 'seguridad',
    tags: ['videovigilancia', 'seguridad', 'empresas'],
    published: true,
    publishedAt: '2024-01-15T00:00:00.000Z',
    author: 'Duartec Team',
    readingTime: 5
  }
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
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}