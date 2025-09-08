import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
// Load .env.local first if present, then fall back to .env
const envLocal = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocal)) {dotenv.config({ path: envLocal });}
dotenv.config();
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { projects } from '../../db/schema';
import { eq } from 'drizzle-orm';

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

    // Upsert by slug
    await db
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
      })
      .onConflictDoUpdate({
        target: projects.slug,
        set: {
          title: fm.title,
          description: fm.description ?? null,
          content,
          category: fm.category ?? null,
          image: fm.image ?? null,
          date,
          updatedAt: now,
        },
      });

    console.log(`Upserted project: ${fm.slug}`);
  }

  console.log('✅ Projects seeding completed successfully');
}

seed().catch((err) => {
  console.error('❌ Error seeding projects:', err);
  process.exit(1);
});