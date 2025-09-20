<<<<<<< HEAD
import { db } from '../db/client';
import { projects } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { allProyectos } from 'contentlayer/generated';
import { withDb } from './db-utils';

// Tipos de contenido desde contentlayer
type ContentLayerProject = (typeof allProyectos)[number];

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  date: Date | null;
};

function fallbackProjectFromContentLayer(p: ContentLayerProject): ProjectRow {
  return {
    id: 0,
    slug: p.slug,
    title: p.title ?? p.slug,
    description: p.description ?? null,
    content: p.body?.raw ?? null,
    image: p.image ?? null,
    category: p.category ?? null,
    date: p.date ? new Date(p.date) : null,
  };
}

function fallbackProjects(): ProjectRow[] {
  return allProyectos.map(fallbackProjectFromContentLayer);
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  return withDb(
    async () => {
      const rows = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.date));
      return rows as unknown as ProjectRow[];
    },
    fallbackProjects()
  );
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const fallback = () => {
    const p = allProyectos.find((x) => x.slug === slug);
    return p ? fallbackProjectFromContentLayer(p) : null;
  };

  return withDb(
    async () => {
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);
      return (result[0] as unknown as ProjectRow) ?? null;
    },
    fallback()
  );
}
=======
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
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
