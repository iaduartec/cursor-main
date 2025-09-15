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
import { db } from '../db/client';
import { streams } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { withDb } from './db-utils';

export type StreamRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  provider: string;
  youtubeId: string | null;
  embedUrl: string | null;
  image: string | null;
  isLive: boolean;
};

// Datos de respaldo en caso de que la BD no esté disponible
const fallbackStreams: StreamRow[] = [
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
  },
];

export async function getAllStreams(): Promise<StreamRow[]> {
  return withDb(
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedDb = db as any;
      const rows = await typedDb
        .select()
        .from(streams)
        .orderBy(asc(streams.name));
      return rows;
    },
    fallbackStreams
  );
}

export async function getStreamBySlug(slug: string): Promise<StreamRow | null> {
  return withDb(
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedDb = db as any;
      const result = await typedDb
        .select()
        .from(streams)
        .where(eq(streams.slug, slug))
        .limit(1);
      return result[0] ?? null;
    },
    fallbackStreams.find((s) => s.slug === slug) ?? null
  );
}
