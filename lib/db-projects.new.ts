// Fallback data when Contentlayer is disabled
const fallbackProjects = [
  {
    id: 1,
    slug: 'instalacion-redes-oficina',
    title: 'Instalación de Redes en Oficina Corporativa',
    description: 'Instalación completa de red informática para empresa de 50 empleados en Burgos.',
    content: 'Proyecto de instalación de red completa incluyendo cableado estructurado, switches, routers y puntos de red.',
    image: '/images/proyectos/redes-oficina.jpg',
    category: 'informatica',
    location: 'Burgos',
    date: '2024-01-15',
    featured: true,
    technologies: ['Cableado estructurado', 'Switches Cisco', 'WiFi 6', 'Servidor Windows'],
    client: 'Empresa ABC S.L.',
    duration: '2 semanas',
    budget: '15.000€'
  },
  {
    id: 2,
    slug: 'sistema-videovigilancia-supermercado',
    title: 'Sistema de Videovigilancia para Supermercado',
    description: 'Instalación de sistema CCTV completo con 16 cámaras en supermercado local.',
    content: 'Instalación de 16 cámaras IP, servidor de grabación, monitores y software de gestión.',
    image: '/images/proyectos/videovigilancia-supermercado.jpg',
    category: 'videovigilancia',
    location: 'Burgos',
    date: '2024-02-20',
    featured: true,
    technologies: ['Cámaras IP', 'Servidor DVR', 'Software de gestión', 'Monitores 4K'],
    client: 'Supermercado XYZ',
    duration: '1 semana',
    budget: '8.000€'
  }
];

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  location: string;
  date: string;
  featured: boolean;
  technologies: string[];
  client: string;
  duration: string;
  budget: string;
};

export async function getAllProjects(): Promise<Project[]> {
  // Return fallback data when Contentlayer is disabled
  return fallbackProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find(project => project.slug === slug) || null;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter(project => project.featured);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter(project => project.category === category);
}
