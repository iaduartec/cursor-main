import { asc, eq } from 'drizzle-orm';

import { db } from '../db/client';
import { services } from '../db/schema';
import { allServicios } from 'contentlayer/generated';
import { withDb } from './db-utils';

export type ContentLayerService = (typeof allServicios)[number];

export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  areaServed: string | null;
  hasOfferCatalog: boolean;
};

function fallbackServiceFromContentLayer(service: ContentLayerService): ServiceRow {
  return {
    id: 0,
    slug: service.slug,
    title: service.title,
    description: service.description ?? null,
    image: service.image ?? null,
    areaServed: service.areaServed ?? null,
    hasOfferCatalog: Boolean(service.hasOfferCatalog),
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
    fallbackServices()
  );
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const fallback = (): ServiceRow | null => {
    const match = allServicios.find((entry) => entry.slug === slug);
    return match ? fallbackServiceFromContentLayer(match) : null;
  };

  return withDb(
    async () => {
      const result = await db
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);

      return (result[0] as unknown as ServiceRow) ?? null;
    },
    fallback()
  );
}
