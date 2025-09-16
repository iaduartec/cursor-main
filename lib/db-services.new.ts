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
import { db, type DrizzleClient } from '../db/client';
import { services, type Service } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { allServicios } from 'contentlayer/generated';
import { withDb } from './db-utils';

// Tipos de contenido desde contentlayer
type ContentLayerService = typeof allServicios[number];

function fallbackServiceFromContentLayer(s: ContentLayerService): Service {
  return {
    id: 0,
    slug: s.slug,
    title: s.title,
    description: s.description,
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
  const typedDb = db as unknown as DrizzleClient;

      const rows = await typedDb
        .select()
        .from(services)
        .orderBy(asc(services.title));
      return rows as Service[];
    },
    fallbackServices()
  );
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const fallback = () => {
    const s = allServicios.find((x) => x.slug === slug);
    return s ? fallbackServiceFromContentLayer(s) : null;
  };

  return withDb(
    async () => {
  const typedDb = db as unknown as DrizzleClient;

      const result = await typedDb
        .select()
        .from(services)
        .where(eq(services.slug, slug))
        .limit(1);
      return (result[0] as Service) ?? null;
    },
    fallback()
  );
}
