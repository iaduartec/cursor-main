/**
Resumen generado automáticamente.

scripts/db/seed-from-mdx.ts

2025-09-13T06:20:07.385Z

——————————————————————————————
Archivo .ts: seed-from-mdx.ts
Tamaño: 2288 caracteres, 85 líneas
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
import { posts } from '../../db/schema';
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
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const files = await getBlogFiles(blogDir);
  console.log(`Found ${files.length} blog files to seed`);

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const fm = data as Partial<Frontmatter>;

    if (!fm.slug || !fm.title || !fm.date) {
      console.warn(`Skipping ${path.basename(file)}: missing slug/title/date`);
      continue;
    }

    const date = new Date(fm.date as string);
    const now = new Date();

    // Upsert by slug
    await db
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
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: fm.title,
          description: fm.description ?? null,
          content,
          category: fm.category ?? null,
          image: fm.image ?? null,
          date,
          published: true,
          updatedAt: now,
        },
      });

    console.log(`Upserted post: ${fm.slug}`);
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
