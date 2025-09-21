import { asc, eq } from 'drizzle-orm';

import { db, type DrizzleClient } from '../db/client';
import { streams, type Stream } from '../db/schema';
import { withDb } from './db-utils';

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

const getTypedDb = () => db as unknown as DrizzleClient;

export async function getAllStreams(): Promise<Stream[]> {
  return withDb(
    async () => {
      const rows = await getTypedDb()
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
      const result = await getTypedDb()
        .select()
        .from(streams)
        .where(eq(streams.slug, slug))
        .limit(1);

      return (result[0] as Stream) ?? null;
    },
    fallbackStreams.find((stream) => stream.slug === slug) ?? null
  );
}
