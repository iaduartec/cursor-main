/**
Resumen generado automáticamente.

app/api/streams/[slug]/route.ts

2025-09-13T06:20:07.361Z

——————————————————————————————
Archivo .ts: route.ts
Tamaño: 2037 caracteres, 53 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { NextRequest, NextResponse } from 'next/server';
import { getStreamBySlug } from '../../../../lib/db-streams';
import { db } from '../../../../db/client';
import { streams } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const expected = process.env.ADMIN_TOKEN || '';
  return expected !== '' && token === expected;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getStreamBySlug(slug);
  if (!item) {return NextResponse.json({ error: 'Not found' }, { status: 404 });}
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(req)) {return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });}
  const { slug } = await params;
  const patch = await req.json().catch(() => ({}));
  const now = new Date();
  const res = await db
    .update(streams)
    .set({
      name: patch.name,
      description: patch.description ?? null,
      provider: patch.provider,
      youtubeId: patch.youtubeId ?? null,
      embedUrl: patch.embedUrl ?? null,
      image: patch.image ?? null,
      isLive: typeof patch.isLive === 'boolean' ? patch.isLive : undefined,
      updatedAt: now,
    } as any)
    .where(eq(streams.slug, slug));

  revalidateTag('streams');
  return NextResponse.json({ ok: true, res });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(req)) {return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });}
  const { slug } = await params;
  await db.delete(streams).where(eq(streams.slug, slug));
  revalidateTag('streams');
  return NextResponse.json({ ok: true });
}

