import { NextRequest, NextResponse } from 'next/server';
import { getAllStreams } from '../../../lib/db-streams';
import { db } from '../../../db/client';
import { streams } from '../../../db/schema';
import { revalidateTag } from 'next/cache';

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const expected = process.env.ADMIN_TOKEN || '';
  return expected !== '' && token === expected;
}

export const GET = async () => {
  const items = await getAllStreams();
  return NextResponse.json({ items });
};

export const POST = async (req: NextRequest) => {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { slug, name, description, provider = 'youtube', youtubeId, embedUrl, image, isLive = true } = body || {};
  if (!slug || !name) {
    return NextResponse.json({ error: 'Missing slug or name' }, { status: 400 });
  }
  const now = new Date();
  await db
    .insert(streams)
    .values({
      slug,
      name,
      description: description ?? null,
      provider,
      youtubeId: youtubeId ?? null,
      embedUrl: embedUrl ?? null,
      image: image ?? null,
      isLive: Boolean(isLive),
      createdAt: now,
      updatedAt: now,
    });
  revalidateTag('streams');
  return NextResponse.json({ ok: true });
};
<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { getAllStreams } from '../../../lib/db-streams';
import { db } from '../../../db/client';
import { streams } from '../../../db/schema';
=======
/**
Resumen generado automáticamente.

app/api/streams/route.ts

2025-09-13T06:20:07.361Z

——————————————————————————————
Archivo .ts: route.ts
Tamaño: 1793 caracteres, 61 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { NextRequest, NextResponse } from 'next/server';
import { getAllStreams } from '../../../lib/db-streams';
import { db, type DrizzleClient } from '../../../db/client';
import { streams, type NewStream } from '../../../db/schema';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { revalidateTag } from 'next/cache';

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const expected = process.env.ADMIN_TOKEN || '';
  return expected !== '' && token === expected;
}

export async function GET() {
  const items = await getAllStreams();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { slug, name, description, provider = 'youtube', youtubeId, embedUrl, image, isLive = true } = body || {};
  if (!slug || !name) {
    return NextResponse.json({ error: 'Missing slug or name' }, { status: 400 });
  }
  const now = new Date();
<<<<<<< HEAD
  await db
=======
  const typedDb = db as unknown as DrizzleClient;
  await typedDb
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
    .insert(streams)
    .values({
      slug,
      name,
      description: description ?? null,
      provider,
      youtubeId: youtubeId ?? null,
      embedUrl: embedUrl ?? null,
      image: image ?? null,
      isLive: Boolean(isLive),
      createdAt: now,
      updatedAt: now,
<<<<<<< HEAD
    })
    .onConflictDoUpdate({
      target: streams.slug,
      set: {
=======

    import { NextRequest, NextResponse } from 'next/server';
    import { db } from '../../../db/client';
    import { streams } from '../../../db/schema';
    import { revalidateTag } from 'next/cache';

    export const GET = async () => {
      const items = await db.select().from(streams);
      return NextResponse.json(items);
    };

    export const POST = async (req: NextRequest) => {
      const body = await req.json();
      const now = new Date();
      const res = await db.insert(streams).values({
        ...body,
        updatedAt: now,
        createdAt: now,
      });
      revalidateTag('streams');
      return NextResponse.json({ ok: true, res });
    };
}


