/**
Resumen generado automáticamente.

scripts/db/seed-projects.ts

2025-09-13T06:20:07.385Z

——————————————————————————————
Archivo .ts: seed-projects.ts
Tamaño: 2537 caracteres, 91 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
// Load .env.local first if present, then fall back to .env
const envLocal = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocal)) {dotenv.config({ path: envLocal });}
dotenv.config();
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { projects, type NewProject } from '../../db/schema';
// import { eq } from 'drizzle-orm'; // No se utiliza

type ProjectFrontmatter = {
  title: string;
  date: string | Date;
  description?: string;
  slug: string;
  category?: string;
  image?: string;
};

async function getProjectFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.mdx'))
    .map((e) => path.join(dir, e.name));
}

async function seed() {
  const { db } = await import('../../db/client');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedDb = db as any;
  const projectsDir = path.join(process.cwd(), 'content', 'proyectos');
  
  // Check if projects directory exists
  if (!fs.existsSync(projectsDir)) {
    console.error(`Projects directory not found: ${projectsDir}`);
    return;
  }

  const files = await getProjectFiles(projectsDir);
  console.log(`Found ${files.length} project files to seed`);

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const fm = data as Partial<ProjectFrontmatter>;

    if (!fm.slug || !fm.title || !fm.date) {
      console.warn(`Skipping ${path.basename(file)}: missing slug/title/date`);
      continue;
    }

    const date = new Date(fm.date as string);
    const now = new Date();

    // Upsert by slug (cast inserted objects to NewProject to get per-file typing)
    await typedDb
      .insert(projects)
      .values({
        slug: fm.slug,
        title: fm.title,
        description: fm.description ?? null,
        content,
        category: fm.category ?? null,
        image: fm.image ?? null,
        date,
        createdAt: now,
        updatedAt: now,
      } as NewProject)
      .onConflictDoUpdate({
        target: projects.slug,
        set: ({
          title: fm.title,
          description: fm.description ?? null,
          content,
          category: fm.category ?? null,
          image: fm.image ?? null,
          date,
          updatedAt: now,
        } as Partial<NewProject>),
      });

    console.log(`Upserted project: ${fm.slug}`);
  }

  console.log('✅ Projects seeding completed successfully');
}

seed().catch((err) => {
  console.error('❌ Error seeding projects:', err);
  process.exit(1);
});