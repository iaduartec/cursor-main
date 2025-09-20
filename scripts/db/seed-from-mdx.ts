import { posts, type NewPost } from '../../db/schema';
import type { DrizzleClient } from '../../db/client';
// import { eq } from 'drizzle-orm'; // No se utiliza

type Frontmatter = {
  title: string;
  date: string | Date;
  description?: string;
  slug: string;
  category?: string;
  image?: string;
};

async function getBlogFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.mdx'))
    .map((e) => path.join(dir, e.name));
}

async function seed() {
  const { db } = await import('../../db/client');
    // Upsert by slug (cast to NewPost for per-file typing)
    await typedDb
      .insert(posts)
      .values({
        slug: fm.slug,
        title: fm.title,
        description: fm.description ?? null,
        content,
        category: fm.category ?? null,
        image: fm.image ?? null,
        date,
        published: true,
        updatedAt: now,
        createdAt: now,
      } as NewPost)
      .onConflictDoUpdate({
        target: posts.slug,
        set: ({
          title: fm.title,
          description: fm.description ?? null,
          content,
          category: fm.category ?? null,
          image: fm.image ?? null,
          date,
          published: true,
          updatedAt: now,
        } as Partial<NewPost>),
      });

    console.log(`Upserted post: ${fm.slug}`);
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
