/**
Resumen generado automáticamente.

scripts/db/seed-streams.ts

2025-09-13T06:20:07.385Z

——————————————————————————————
Archivo .ts: seed-streams.ts
Tamaño: 2110 caracteres, 68 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
const envLocal = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocal)) {dotenv.config({ path: envLocal });}
dotenv.config();

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
  const typedDb = db as unknown as PgDatabase<any, Database>;
  for (const s of initial) {
    const now = new Date();
    const image = s.image || (s.youtubeId ? `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg` : undefined);
    const embedUrl = s.embedUrl || (s.youtubeId ? `https://www.youtube.com/embed/${s.youtubeId}` : undefined);
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
