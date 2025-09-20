<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

scripts/db/seed-services.ts

2025-09-13T06:20:07.385Z

——————————————————————————————
Archivo .ts: seed-services.ts
Tamaño: 2417 caracteres, 88 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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
<<<<<<< HEAD
import { services } from '../../db/schema';
=======
import { services, type NewService } from '../../db/schema';
import type { DrizzleClient } from '../../db/client';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

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
<<<<<<< HEAD
=======
  const typedDb = db as unknown as DrizzleClient;
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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

<<<<<<< HEAD
    await db
=======
    await typedDb
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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
<<<<<<< HEAD
      })
      .onConflictDoUpdate({
        target: services.slug,
        set: {
=======
      } as NewService)
      .onConflictDoUpdate({
        target: services.slug,
        set: ({
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
          title: fm.title,
          description: fm.description ?? null,
          image: fm.image ?? null,
          areaServed: fm.areaServed ?? null,
          hasOfferCatalog: fm.hasOfferCatalog ?? false,
          updatedAt: now,
<<<<<<< HEAD
        },
=======
        } as Partial<NewService>),
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
      });

    console.log(`Upserted service: ${fm.slug}`);
  }

  console.log('✅ Services seeding completed successfully');
}

seed().catch((err) => {
  console.error('❌ Error seeding services:', err);
  process.exit(1);
});
