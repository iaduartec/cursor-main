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
import { allProyectos } from 'contentlayer/generated';

// Tipos de contenido desde contentlayer
type ContentLayerProject = (typeof allProyectos)[number];

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  date: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function projectFromContentLayer(p: ContentLayerProject): Project {
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
  };
}

export async function getAllProjects(): Promise<Project[]> {
  return allProyectos.map(projectFromContentLayer).sort((a, b) => {
    if (!a.date && !b.date) {
      return 0;
    }
    if (!a.date) {
      return 1;
    }
    if (!b.date) {
      return -1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const p = allProyectos.find(x => x.slug === slug);
  return p ? projectFromContentLayer(p) : null;
}
