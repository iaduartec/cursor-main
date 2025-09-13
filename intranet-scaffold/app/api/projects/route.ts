import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

function checkAdminAccess(req: Request) {
  const token = process.env.INTRANET_DEBUG_TOKEN;
  if (token) {
    const provided = req.headers.get('x-debug-token') || '';
    return provided === token;
  }
  // if no token configured, allow in non-production
  if (process.env.NODE_ENV === 'production') {return false;}
  return true;
}

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT id, slug, title, description, hero_image, created_at FROM projects ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error('API /api/projects GET error:', err);
    // If DB is not configured (common in local dev), return empty list instead of 500
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json([]);
    }
    // Unknown error -> bubble up as 500
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!checkAdminAccess(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { slug, title, description, hero_image } = body;
    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 422 });
    }
    // basic slug sanity
    if (!/^[a-z0-9-_]+$/i.test(slug)) {
      return NextResponse.json({ error: 'slug contains invalid characters' }, { status: 422 });
    }
    const sql = getDb();
    // uniqueness check
    const exists = await sql`SELECT id FROM projects WHERE slug = ${slug}`;
    if (exists && exists.length > 0) {
      return NextResponse.json({ error: 'slug already exists' }, { status: 409 });
    }
    const inserted = await sql`
      INSERT INTO projects (slug, title, description, hero_image)
      VALUES (${slug}, ${title}, ${description}, ${hero_image})
      RETURNING id, slug, title, description, hero_image, created_at
    `;
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err: any) {
      console.error('API /api/projects POST error:', err);
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
