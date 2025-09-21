import { allProyectos } from 'contentlayer/generated';
import { desc, eq } from 'drizzle-orm';

import { db } from '../db/client';
import { projects } from '../db/schema';
import { withDb } from './db-utils';

// Tipos de contenido desde Contentlayer
export type ContentLayerProject = (typeof allProyectos)[number];

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

function fallbackProjectFromContentLayer(project: ContentLayerProject): ProjectRow {
  return {
    id: 0,
    slug: project.slug,
    title: project.title ?? project.slug,
    description: project.description ?? null,
    content: project.body?.raw ?? null,
    image: project.image ?? null,
    category: project.category ?? null,
    date: project.date ? new Date(project.date) : null,
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
  const fallback = (): ProjectRow | null => {
    const project = allProyectos.find((entry) => entry.slug === slug);
    return project ? fallbackProjectFromContentLayer(project) : null;
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

