import { db } from '../db/client';
import { servexport async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
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
  );./db/schema';
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

function fallbackServiceFromContentLayer(s: typeof allServicios[0]): ServiceRow {
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
  return withDb(
    async () => {
      const result = await db
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);
      return result[0] ?? null;
    },
    () => {
      const s = allServicios.find((x) => x.slug === slug);
      return s ? fallbackServiceFromContentLayer(s) : null;
    }()
  );
    };
  }
  try {
    const [row] = await db
      .select({
        id: services.id,
        slug: services.slug,
        title: services.title,
        description: services.description,
        image: services.image,
        areaServed: services.areaServed,
        hasOfferCatalog: services.hasOfferCatalog,
      })
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);
    if (row) {return row as unknown as ServiceRow;}
  } catch (e) {
    console.error('DB getServiceBySlug error', e);
  }
  return null;
}

function fallbackServices(): ServiceRow[] {
  return allServicios.map((s) => ({
    id: 0,
    slug: s.slug,
    title: s.title,
    description: s.description,
    image: s.image ?? null,
    areaServed: s.areaServed ?? null,
    hasOfferCatalog: Boolean(s.hasOfferCatalog),
  }));
}

