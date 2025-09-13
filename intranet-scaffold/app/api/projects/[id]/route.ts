import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

function checkAdminAccess(req: Request) {
  const token = process.env.INTRANET_DEBUG_TOKEN;
  if (token) {
    const provided = req.headers.get('x-debug-token') || '';
    return provided === token;
  }
  if (process.env.NODE_ENV === 'production') {return false;}
  return true;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const resolvedParams: any = await params;
  const id = Number(resolvedParams.id);
  if (!checkAdminAccess(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { slug, title, description, hero_image } = body;
    const sql = getDb();
    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 422 });
    }
    const updated = await sql`
      UPDATE projects SET slug = ${slug}, title = ${title}, description = ${description}, hero_image = ${hero_image}
      WHERE id = ${id}
      RETURNING id, slug, title, description, hero_image, created_at
    `;
    if (!updated || updated.length === 0) {
      // Fallback: if nothing was updated by id, try to find the record by slug and update by that id.
      if (slug) {
        const found = await sql`SELECT id FROM projects WHERE slug = ${slug}`;
        const foundId = found && found[0] && found[0].id;
        if (foundId) {
          const updatedByFoundId = await sql`\
            UPDATE projects SET slug = ${slug}, title = ${title}, description = ${description}, hero_image = ${hero_image}\
            WHERE id = ${foundId}\
            RETURNING id, slug, title, description, hero_image, created_at\
          `;
          if (updatedByFoundId && updatedByFoundId.length > 0) {
            return NextResponse.json(updatedByFoundId[0]);
          }
        }
      }
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch (err: any) {
    console.error('API /api/projects/[id] PUT error:', err);
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const resolvedParams: any = await params;
  const id = Number(resolvedParams.id);
  if (!checkAdminAccess(_req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const sql = getDb();
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('API /api/projects/[id] DELETE error:', err);
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
