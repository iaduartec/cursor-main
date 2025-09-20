import { services, type NewService } from '../../db/schema';
import type { DrizzleClient } from '../../db/client';

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
    await typedDb
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
      } as NewService)
      .onConflictDoUpdate({
        target: services.slug,
        set: ({
          title: fm.title,
          description: fm.description ?? null,
          image: fm.image ?? null,
          areaServed: fm.areaServed ?? null,
          hasOfferCatalog: fm.hasOfferCatalog ?? false,
          updatedAt: now,
        } as Partial<NewService>),
      });

    console.log(`Upserted service: ${fm.slug}`);
  }

  console.log('✅ Services seeding completed successfully');
}

seed().catch((err) => {
  console.error('❌ Error seeding services:', err);
  process.exit(1);
});
