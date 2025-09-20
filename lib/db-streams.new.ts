<<<<<<< HEAD
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
=======
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
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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
<<<<<<< HEAD
  },
];

export async function getAllStreams(): Promise<StreamRow[]> {
  return withDb(
    async () => {
      const rows = await db
        .select()
        .from(streams)
        .orderBy(asc(streams.name));
      return rows;
=======
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
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
    },
    fallbackStreams
  );
}

<<<<<<< HEAD
export async function getStreamBySlug(slug: string): Promise<StreamRow | null> {
  return withDb(
    async () => {
      const result = await db
=======
export async function getStreamBySlug(slug: string): Promise<Stream | null> {
  return withDb(
    async () => {
  const typedDb = db as unknown as DrizzleClient;
      const result = await typedDb
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
        .select()
        .from(streams)
        .where(eq(streams.slug, slug))
        .limit(1);
<<<<<<< HEAD
      return result[0] ?? null;
=======
      return (result[0] as Stream) ?? null;
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
    },
    fallbackStreams.find((s) => s.slug === slug) ?? null
  );
}
