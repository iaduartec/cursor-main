import { db } from '../db/client';
import { streams } from '../db/schema';
import { asc } from 'drizzle-orm';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

// Load environment variables if not already loaded
if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
  const envLocal = join(process.cwd(), '.env.local');
  const envFile = join(process.cwd(), '.env');
  if (existsSync(envLocal)) {
    dotenv.config({ path: envLocal });
  } else if (existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
}

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

const hasDb = () =>
  Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL
  );

export async function getAllStreams(): Promise<StreamRow[]> {
  if (!hasDb()) {
    return fallbackStreams();
  }
  try {
    const rows = await db
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
    // Si el cliente de DB está en modo "fake" o la tabla aún no tiene datos,
    // Drizzle devolverá un array vacío. En ese caso mostramos el contenido
    // de respaldo para que la sección de cámaras nunca aparezca vacía.
    const list = (rows as unknown as StreamRow[]) || [];
    if (!Array.isArray(list) || list.length === 0) {
      return fallbackStreams();
    }
    return list;
  } catch (e) {
    console.error('DB getAllStreams error', e);
    return fallbackStreams();
  }
}

export async function getStreamBySlug(slug: string): Promise<StreamRow | null> {
  const s = (await getAllStreams()).find(x => x.slug === slug);
  return s || null;
}

function fallbackStreams(): StreamRow[] {
  const list = [
    { slug: 'silos', name: 'Santo Domingo de Silos', youtubeId: 'czwL7LgjyjU' },
    {
      slug: 'rabanera-del-pinar',
      name: 'Rabanera del Pinar',
      youtubeId: '2FLLNsHmgxc',
    },
    {
      slug: 'pineda-de-la-sierra',
      name: 'Pineda de la Sierra',
      youtubeId: 'MqU3cNr22XQ',
    },
    {
      slug: 'huerta-de-arriba',
      name: 'Huerta de Arriba',
      youtubeId: 'Kv2HeXZXWaw',
    },
  ];
  return list.map((s, i) => ({
    id: i + 1,
    slug: s.slug,
    name: s.name,
    description: null,
    provider: 'youtube',
    youtubeId: s.youtubeId || null,
    embedUrl: s.youtubeId
      ? `https://www.youtube.com/embed/${s.youtubeId}`
      : null,
    image: s.youtubeId
      ? `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`
      : null,
    isLive: true,
  }));
}
