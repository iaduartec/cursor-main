<<<<<<< HEAD
import { db } from '../db/client';
import { streams } from '../db/schema';
import { asc } from 'drizzle-orm';

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

const hasDb = () => Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL);

export async function getAllStreams(): Promise<StreamRow[]> {
  if (!hasDb()) {return fallbackStreams();}
  try {
    const rows = await db
=======
/**
Resumen generado automáticamente.

lib/db-streams.ts

2025-09-13T06:20:07.380Z

——————————————————————————————
Archivo .ts: db-streams.ts
Tamaño: 2069 caracteres, 68 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { db, type DrizzleClient } from '../db/client';
import { streams, type Stream } from '../db/schema';
import { asc } from 'drizzle-orm';

const hasDb = () => Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL);

export async function getAllStreams(): Promise<Stream[]> {
  if (!hasDb()) {return fallbackStreams();}
  try {
  const typedDb = db as unknown as DrizzleClient;

    const rows = await typedDb
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
      .select({
        id: streams.id,
        slug: streams.slug,
        name: streams.name,
        description: streams.description,
        provider: streams.provider,
        youtubeId: streams.youtubeId,
        embedUrl: streams.embedUrl,
        image: streams.image,
        isLive: streams.isLive,
      })
      .from(streams)
      .orderBy(asc(streams.name));
<<<<<<< HEAD
    return rows as unknown as StreamRow[];
=======
  return rows as unknown as Stream[];
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  } catch (e) {
    console.error('DB getAllStreams error', e);
    return fallbackStreams();
  }
}

<<<<<<< HEAD
export async function getStreamBySlug(slug: string): Promise<StreamRow | null> {
=======
export async function getStreamBySlug(slug: string): Promise<Stream | null> {
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  const s = (await getAllStreams()).find((x) => x.slug === slug);
  return s || null;
}

<<<<<<< HEAD
function fallbackStreams(): StreamRow[] {
=======
function fallbackStreams(): Stream[] {
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  const list = [
    { slug: 'silos', name: 'Santo Domingo de Silos', youtubeId: 'czwL7LgjyjU' },
    { slug: 'rabanera-del-pinar', name: 'Rabanera del Pinar', youtubeId: '2FLLNsHmgxc' },
    { slug: 'pineda-de-la-sierra', name: 'Pineda de la Sierra', youtubeId: 'MqU3cNr22XQ' },
    { slug: 'huerta-de-arriba', name: 'Huerta de Arriba', youtubeId: 'Kv2HeXZXWaw' },
  ];
  return list.map((s, i) => ({
    id: i + 1,
    slug: s.slug,
    name: s.name,
    description: null,
    provider: 'youtube',
    youtubeId: s.youtubeId || null,
    embedUrl: s.youtubeId ? `https://www.youtube.com/embed/${s.youtubeId}` : null,
    image: s.youtubeId ? `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg` : null,
    isLive: true,
<<<<<<< HEAD
  }));
=======
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Stream));
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
}

