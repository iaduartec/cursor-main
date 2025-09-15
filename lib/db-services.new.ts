/**
Resumen generado automáticamente.

lib/db-services.new.ts

2025-09-13T06:20:07.379Z

——————————————————————————————
Archivo .ts: db-services.new.ts
Tamaño: 1621 caracteres, 67 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
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
      // Local typed cast for incremental typing migration.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedDb = db as any;

      const rows = await typedDb
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedDb = db as any;

      const result = await typedDb
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);
      return result[0] ?? null;
    },
    fallback()
  );
}
