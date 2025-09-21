import { db } from '../db/client';
import { services } from '../db/schema';
import { asc, eq } from 'drizzle-orm';

// Helper function to get allServicios conditionally
async function getAllServicios(): Promise<any[]> {
  if (process.env.VERCEL === '1' || process.env.SKIP_CONTENTLAYER === '1') {
    return [];
  }
  try {
    const { allServicios = [] } = await import('contentlayer/generated');
    return allServicios;
  } catch {
    // Contentlayer not available, return empty array
    return [];
  }
}

export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  areaServed: string | null;
  hasOfferCatalog: boolean;
};

const hasDb = () =>
  Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL
  );

export async function getAllServices(): Promise<ServiceRow[]> {
  if (!hasDb()) {
    return fallbackServices();
  }
  try {
    const rows = await db
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
      .orderBy(asc(services.title));
    return rows as unknown as ServiceRow[];
  } catch (e) {
    console.error('DB getAllServices error', e);
    return fallbackServices();
  }
}

export async function getServiceBySlug(
  slug: string
): Promise<ServiceRow | null> {
  if (!hasDb()) {
    const allServicios = await getAllServicios();
    const s = allServicios.find(x => x.slug === slug);
    if (!s) {
      return null;
    }
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
    if (row) {
      return row as unknown as ServiceRow;
    }
  } catch (e) {
    console.error('DB getServiceBySlug error', e);
  }
  return null;
}

async function fallbackServices(): Promise<ServiceRow[]> {
  const allServicios = await getAllServicios();
  return allServicios.map(s => ({
    id: 0,
    slug: s.slug,
    title: s.title,
    description: s.description,
    image: s.image ?? null,
    areaServed: s.areaServed ?? null,
    hasOfferCatalog: Boolean(s.hasOfferCatalog),
  }));
}
