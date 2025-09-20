<<<<<<< HEAD
import { db } from '../db/client';
import { services } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { allServicios } from 'contentlayer/generated';
import { withDb } from './db-utils';

// Tipos de contenido desde contentlayer
type ContentLayerService = typeof allServicios[number];

export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  areaServed: string | null;
  hasOfferCatalog: boolean;
};

function fallbackServiceFromContentLayer(s: ContentLayerService): ServiceRow {
  return {
    id: 0,
    slug: s.slug,
    title: s.title,
    description: s.description,
    image: s.image ?? null,
    areaServed: s.areaServed ?? null,
    hasOfferCatalog: Boolean(s.hasOfferCatalog),
  };
}

function fallbackServices(): ServiceRow[] {
  return allServicios.map(fallbackServiceFromContentLayer);
}

export async function getAllServices(): Promise<ServiceRow[]> {
  return withDb(
    async () => {
      const rows = await db
        .select()
        .from(services)
        .orderBy(asc(services.title));
      return rows;
    },
    fallbackServices()
  );
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const fallback = () => {
    const s = allServicios.find((x) => x.slug === slug);
    return s ? fallbackServiceFromContentLayer(s) : null;
  };
  
  return withDb(
    async () => {
      const result = await db
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);
      return result[0] ?? null;
    },
    fallback()
  );
=======
// Fallback data when Contentlayer is disabled
const fallbackServices = [
  {
    id: 1,
    slug: 'informatica',
    title: 'Servicios Informáticos',
    description:
      'Instalación, mantenimiento y soporte técnico de equipos informáticos.',
    content:
      'Ofrecemos servicios completos de informática incluyendo instalación de equipos, mantenimiento preventivo, soporte técnico y consultoría.',
    icon: 'Monitor',
    category: 'informatica',
    featured: true,
  },
  {
    id: 2,
    slug: 'videovigilancia',
    title: 'Videovigilancia (CCTV)',
    description:
      'Instalación y mantenimiento de sistemas de videovigilancia y seguridad.',
    content:
      'Sistemas completos de videovigilancia con cámaras IP, grabadores DVR/NVR, monitores y software de gestión.',
    icon: 'Camera',
    category: 'videovigilancia',
    featured: true,
  },
  {
    id: 3,
    slug: 'sonido',
    title: 'Sonido Profesional',
    description:
      'Instalación de sistemas de sonido para eventos, locales comerciales y hogares.',
    content:
      'Equipos de sonido profesional, megafonía, sistemas de conferencias y sonorización de espacios.',
    icon: 'Volume2',
    category: 'sonido',
    featured: true,
  },
  {
    id: 4,
    slug: 'electricidad',
    title: 'Instalaciones Eléctricas',
    description:
      'Instalaciones eléctricas residenciales, comerciales e industriales.',
    content:
      'Proyectos eléctricos completos, reformas, ampliaciones y certificaciones eléctricas.',
    icon: 'Zap',
    category: 'electricidad',
    featured: true,
  },
];

export type Service = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  category: string;
  featured: boolean;
};

export async function getAllServices(): Promise<Service[]> {
  // Return fallback data when Contentlayer is disabled
  return fallbackServices;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getAllServices();
  return services.find(service => service.slug === slug) || null;
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getAllServices();
  return services.filter(service => service.featured);
}

export async function getServicesByCategory(
  category: string
): Promise<Service[]> {
  const services = await getAllServices();
  return services.filter(service => service.category === category);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
}
