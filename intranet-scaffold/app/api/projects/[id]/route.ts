import { NextResponse } from 'next/server';
import { getDb } from '../../../../../lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { slug, title, description, hero_image } = body;
  const sql = getDb();
  const updated = await sql`
    UPDATE projects SET slug = ${slug}, title = ${title}, description = ${description}, hero_image = ${hero_image}
    WHERE id = ${id}
    RETURNING id, slug, title, description, hero_image, created_at
  `;
  if (!updated || updated.length === 0) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated[0]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const sql = getDb();
  await sql`DELETE FROM projects WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
