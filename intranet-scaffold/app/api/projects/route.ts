import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT id, slug, title, description, hero_image, created_at FROM projects ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (err: any) {
    // If DB is not configured (common in local dev), return empty list instead of 500
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json([]);
    }
    // Unknown error -> bubble up as 500
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, description, hero_image } = body;
    const sql = getDb();
    const inserted = await sql`
      INSERT INTO projects (slug, title, description, hero_image)
      VALUES (${slug}, ${title}, ${description}, ${hero_image})
      RETURNING id, slug, title, description, hero_image, created_at
    `;
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err: any) {
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
    }
    return NextResponse.json({ error: err?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
