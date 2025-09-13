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
import { db } from '../../../db/client';
import { streams } from '../../../db/schema';
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
    })
    .onConflictDoUpdate({
      target: streams.slug,
      set: {
        name,
        description: description ?? null,
        provider,
        youtubeId: youtubeId ?? null,
        embedUrl: embedUrl ?? null,
        image: image ?? null,
        isLive: Boolean(isLive),
        updatedAt: now,
      },
    });

  revalidateTag('streams');
  return NextResponse.json({ ok: true });
}

