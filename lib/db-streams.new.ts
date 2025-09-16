/**
Resumen generado automáticamente.

lib/db-streams.new.ts

2025-09-13T06:20:07.380Z

——————————————————————————————
Archivo .ts: db-streams.new.ts
Tamaño: 1330 caracteres, 59 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { db, type DrizzleClient } from '../db/client';
import { streams, type Stream } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { withDb } from './db-utils';

// Datos de respaldo en caso de que la BD no esté disponible
const fallbackStreams: Stream[] = [
  {
    id: 1,
    slug: 'camara-24h',
    name: 'Cámara 24h',
    description: 'Cámara de seguridad en directo',
    provider: 'youtube',
    youtubeId: 'live_stream',
    embedUrl: null,
    image: '/images/webcam.jpg',
    isLive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Stream,
];

export async function getAllStreams(): Promise<Stream[]> {
  return withDb(
    async () => {
  const typedDb = db as unknown as DrizzleClient;
      const rows = await typedDb
        .select()
        .from(streams)
        .orderBy(asc(streams.name));
      return rows as Stream[];
    },
    fallbackStreams
  );
}

export async function getStreamBySlug(slug: string): Promise<Stream | null> {
  return withDb(
    async () => {
  const typedDb = db as unknown as DrizzleClient;
      const result = await typedDb
        .select()
        .from(streams)
        .where(eq(streams.slug, slug))
        .limit(1);
      return (result[0] as Stream) ?? null;
    },
    fallbackStreams.find((s) => s.slug === slug) ?? null
  );
}
