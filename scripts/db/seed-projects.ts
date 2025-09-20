import { projects, type NewProject } from '../../db/schema';
import type { DrizzleClient } from '../../db/client';
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