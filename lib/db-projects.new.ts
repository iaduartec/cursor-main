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
import { projects } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { allProyectos } from 'contentlayer/generated';
import { withDb } from './db-utils';

// Tipos de contenido desde contentlayer
type ContentLayerProject = (typeof allProyectos)[number];

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  date: Date | null;
};

function fallbackProjectFromContentLayer(p: ContentLayerProject): ProjectRow {
  return {
    id: 0,
    slug: p.slug,
    title: p.title ?? p.slug,
    description: p.description ?? null,
    content: p.body?.raw ?? null,
    image: p.image ?? null,
    category: p.category ?? null,
    date: p.date ? new Date(p.date) : null,
  };
}

function fallbackProjects(): ProjectRow[] {
  return allProyectos.map(fallbackProjectFromContentLayer);
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  return withDb(
    async () => {
      const rows = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.date));
      return rows as unknown as ProjectRow[];
    },
    fallbackProjects()
  );
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const fallback = () => {
    const p = allProyectos.find((x) => x.slug === slug);
    return p ? fallbackProjectFromContentLayer(p) : null;
  };

  return withDb(
    async () => {
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);
      return (result[0] as unknown as ProjectRow) ?? null;
    },
    fallback()
  );
}
