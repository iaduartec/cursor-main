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
import { allServicios } from 'contentlayer/generated';

// Tipos de contenido desde contentlayer
type ContentLayerService = (typeof allServicios)[number];

export type Service = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  areaServed: string | null;
  hasOfferCatalog: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function serviceFromContentLayer(s: ContentLayerService): Service {
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
  };
}

export async function getAllServices(): Promise<Service[]> {
  return allServicios
    .map(serviceFromContentLayer)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const s = allServicios.find(x => x.slug === slug);
  return s ? serviceFromContentLayer(s) : null;
}
