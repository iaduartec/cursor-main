import { db } from '../db/client';
import { projects } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

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

const hasDb = () => Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL);

export async function getAllProjects(): Promise<ProjectRow[]> {
  if (!hasDb()) return [];
  try {
    const rows = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        title: projects.title,
        description: projects.description,
        content: projects.content,
        image: projects.image,
        category: projects.category,
        date: projects.date,
      })
      .from(projects)
      .orderBy(desc(projects.date));
    return rows as unknown as ProjectRow[];
  } catch (e) {
    console.error('DB getAllProjects error', e);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  try {
    const [row] = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        title: projects.title,
        description: projects.description,
        content: projects.content,
        image: projects.image,
        category: projects.category,
        date: projects.date,
      })
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    return (row as unknown as ProjectRow) || null;
  } catch (e) {
    console.error('DB getProjectBySlug error', e);
    return null;
  }
}

