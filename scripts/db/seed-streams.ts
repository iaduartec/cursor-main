import { streams, type NewStream, type Database } from '../../db/schema';
import type { PgDatabase } from 'drizzle-orm/pg-core';

type SeedStream = {
  slug: string;
  name: string;
  youtubeId?: string;
  embedUrl?: string;
  image?: string;
  description?: string;
  provider?: string;
};

const initial: SeedStream[] = [
  { slug: 'silos', name: 'Santo Domingo de Silos', youtubeId: 'czwL7LgjyjU', provider: 'youtube' },
  { slug: 'rabanera-del-pinar', name: 'Rabanera del Pinar', youtubeId: '2FLLNsHmgxc', provider: 'youtube' },
  { slug: 'pineda-de-la-sierra', name: 'Pineda de la Sierra', youtubeId: 'MqU3cNr22XQ', provider: 'youtube' },
  { slug: 'huerta-de-arriba', name: 'Huerta de Arriba', youtubeId: 'Kv2HeXZXWaw', provider: 'youtube' },
];

async function run() {
  const { db } = await import('../../db/client');
    await typedDb
      .insert(streams)
      .values({
        slug: s.slug,
        name: s.name,
        description: s.description || null,
        provider: s.provider || 'youtube',
        youtubeId: s.youtubeId || null,
        embedUrl: embedUrl || null,
        image: image || null,
        isLive: true,
        createdAt: now,
        updatedAt: now,
      } as NewStream)
      .onConflictDoUpdate({
        target: streams.slug,
        set: ({
          name: s.name,
          description: s.description || null,
          provider: s.provider || 'youtube',
          youtubeId: s.youtubeId || null,
          embedUrl: embedUrl || null,
          image: image || null,
          isLive: true,
          updatedAt: now,
        } as Partial<NewStream>),
      });
    console.log(`Upserted stream: ${s.slug}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
