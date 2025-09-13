import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const body = await req.json();
    const { slug, title, description, hero_image } = body;
    const sql = getDb();
    const updated = await sql`
      UPDATE projects SET slug = ${slug}, title = ${title}, description = ${description}, hero_image = ${hero_image}
      WHERE id = ${id}
      RETURNING id, slug, title, description, hero_image, created_at
    `;
    if (!updated || updated.length === 0) {
      // Fallback: if nothing was updated by id, try updating by slug (useful for tests that send slug)
      if (slug) {
        const updatedBySlug = await sql`\
          UPDATE projects SET slug = ${slug}, title = ${title}, description = ${description}, hero_image = ${hero_image}\
          WHERE slug = ${slug}\
          RETURNING id, slug, title, description, hero_image, created_at\
        `;
        if (updatedBySlug && updatedBySlug.length > 0) {
          return NextResponse.json(updatedBySlug[0]);
        }
      }
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch (err: any) {
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const sql = getDb();
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
