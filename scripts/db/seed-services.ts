import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
// Load .env.local first if present, then fall back to .env
const envLocal = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
}
dotenv.config();
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { services } from '../../db/schema';

type ServiceFrontmatter = {
  title: string;
  description?: string;
  slug: string;
  image?: string;
  areaServed?: string;
  hasOfferCatalog?: boolean;
};

async function getServiceFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.mdx'))
    .map((e) => path.join(dir, e.name));
}

async function seed() {
  const { db } = await import('../../db/client');
  const servicesDir = path.join(process.cwd(), 'content', 'servicios');
  
  if (!fs.existsSync(servicesDir)) {
    console.error(`Services directory not found: ${servicesDir}`);
    return;
  }

  const files = await getServiceFiles(servicesDir);
  console.log(`Found ${files.length} service files to seed`);

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data } = matter(raw);
    const fm = data as Partial<ServiceFrontmatter>;

    if (!fm.slug || !fm.title) {
      console.warn(`Skipping ${path.basename(file)}: missing slug or title`);
      continue;
    }

    const now = new Date();

    await db
      .insert(services)
      .values({
        slug: fm.slug,
        title: fm.title,
        description: fm.description ?? null,
        image: fm.image ?? null,
        areaServed: fm.areaServed ?? null,
        hasOfferCatalog: fm.hasOfferCatalog ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          title: fm.title,
          description: fm.description ?? null,
          image: fm.image ?? null,
          areaServed: fm.areaServed ?? null,
          hasOfferCatalog: fm.hasOfferCatalog ?? false,
          updatedAt: now,
        },
      });

    console.log(`Upserted service: ${fm.slug}`);
  }

  console.log('✅ Services seeding completed successfully');
}

seed().catch((err) => {
  console.error('❌ Error seeding services:', err);
  process.exit(1);
});
