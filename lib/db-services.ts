<<<<<<< HEAD
// lib/db-services.ts
import { db } from '../db/client';
import { services } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { allServicios } from 'contentlayer/generated';
import { withDb } from './db-utils';
=======
// Fallback data when Contentlayer is disabled
const fallbackServices = [
  {
    id: 1,
    slug: 'informatica',
    title: 'Instalaciones Informáticas',
    description: 'Instalación y mantenimiento de equipos informáticos, redes, servidores y sistemas de comunicación.',
    image: '/images/services/informatica.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  },
  {
    id: 2,
    slug: 'videovigilancia',
    title: 'Videovigilancia y CCTV',
    description: 'Instalación de sistemas de videovigilancia, cámaras IP, grabadores DVR y software de gestión.',
    image: '/images/services/videovigilancia.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  },
  {
    id: 3,
    slug: 'sonido',
    title: 'Sonido Profesional',
    description: 'Instalación de sistemas de sonido profesional para eventos, locales comerciales y espacios públicos.',
    image: '/images/services/sonido.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  },
  {
    id: 4,
    slug: 'electricidad',
    title: 'Instalaciones Eléctricas',
    description: 'Instalaciones eléctricas industriales y domésticas, certificaciones y mantenimiento.',
    image: '/images/services/electricidad.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  }
];
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  areaServed: string | null;
  hasOfferCatalog: boolean;
};

<<<<<<< HEAD
function fallbackServiceFromContentLayer(s: (typeof allServicios)[number]): ServiceRow {
  return {
    id: 0,
    slug: s.slug,
    title: s.title,
    description: s.description ?? null,
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
      return rows as unknown as ServiceRow[];
    },
    // 👇 valor, no función
    fallbackServices()
  );
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  // Fallback ya evaluado (valor)
  const fallback =
    (() => {
      const s = allServicios.find((x) => x.slug === slug);
      return s ? fallbackServiceFromContentLayer(s) : null;
    })();

  return withDb(
    async () => {
      const result = await db
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);

      const row = (result[0] as unknown) as ServiceRow | undefined;
      return row ?? null;
    },
    // 👇 valor, no función
    fallback
  );
=======
export async function getAllServices(): Promise<ServiceRow[]> {
  return fallbackServices;
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const services = await getAllServices();
  return services.find(service => service.slug === slug) || null;
}

export async function getServicesByCategory(category: string): Promise<ServiceRow[]> {
  const services = await getAllServices();
  return services.filter(service => service.slug.includes(category));
}

export async function getFeaturedServices(): Promise<ServiceRow[]> {
  const services = await getAllServices();
  return services.slice(0, 4);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
}
