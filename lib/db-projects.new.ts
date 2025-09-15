/**
Resumen generado automáticamente.

lib/db-projects.new.ts

2025-09-13T06:20:07.379Z

——————————————————————————————
Archivo .ts: db-projects.new.ts
Tamaño: 1736 caracteres, 69 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { db } from '../db/client';
import { projects, type Project } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { allProyectos } from 'contentlayer/generated';
import { withDb } from './db-utils';

// Tipos de contenido desde contentlayer
type ContentLayerProject = (typeof allProyectos)[number];

function fallbackProjectFromContentLayer(p: ContentLayerProject): Project {
  return {
    id: 0,
    slug: p.slug,
    title: p.title ?? p.slug,
    description: p.description ?? null,
    content: p.body?.raw ?? null,
    image: p.image ?? null,
    category: p.category ?? null,
    date: p.date ? new Date(p.date) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Project;
}

function fallbackProjects(): Project[] {
  return allProyectos.map(fallbackProjectFromContentLayer);
}

export async function getAllProjects(): Promise<Project[]> {
  return withDb(
    async () => {
      // Local cast to `any` to progressively migrate this module to typed db
      // without changing global exports. Replace with proper Drizzle types
      // once callers are updated.
      const typedDb = db as any;

      const rows = await typedDb
        .select()
        .from(projects)
        .orderBy(desc(projects.date));
      return rows as unknown as Project[];
    },
    fallbackProjects()
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = () => {
    const p = allProyectos.find((x) => x.slug === slug);
    return p ? fallbackProjectFromContentLayer(p) : null;
  };
  
  return withDb(
    async () => {
      const typedDb = db as any;

      const result = await typedDb
        .select()
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);
      return (result[0] as unknown as Project) ?? null;
    },
    fallback()
  );
}
