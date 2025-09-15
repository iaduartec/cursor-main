/**
Resumen generado automáticamente.

lib/db-services.ts

2025-09-13T06:20:07.379Z

——————————————————————————————
Archivo .ts: db-services.ts
Tamaño: 1753 caracteres, 71 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// lib/db-services.ts
import { db } from '../db/client';
import { services, type Service } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { allServicios } from 'contentlayer/generated';
import { withDb } from './db-utils';

function fallbackServiceFromContentLayer(s: (typeof allServicios)[number]): Service {
  return {
    id: 0,
    slug: s.slug,
    title: s.title,
    description: s.description ?? null,
    image: s.image ?? null,
    areaServed: s.areaServed ?? null,
    hasOfferCatalog: Boolean(s.hasOfferCatalog),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Service;
}

function fallbackServices(): Service[] {
  return allServicios.map(fallbackServiceFromContentLayer);
}

export async function getAllServices(): Promise<Service[]> {
  return withDb(
    async () => {
      // Local cast to allow incremental typing migration for this module.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedDb = db as any;

      const rows = await typedDb
        .select()
        .from(services)
        .orderBy(asc(services.title));
      return rows as unknown as Service[];
    },
    // 👇 valor, no función
    fallbackServices()
  );
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  // Fallback ya evaluado (valor)
  const fallback =
    (() => {
      const s = allServicios.find((x) => x.slug === slug);
      return s ? fallbackServiceFromContentLayer(s) : null;
    })();

  return withDb(
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedDb = db as any;

      const result = await typedDb
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);

      const row = (result[0] as unknown) as Service | undefined;
      return row ?? null;
    },
    // 👇 valor, no función
    fallback
  );
}
