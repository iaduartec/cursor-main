import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT id, slug, title, description, hero_image, created_at FROM projects ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, title, description, hero_image } = body;
  const sql = getDb();
  const inserted = await sql`
    INSERT INTO projects (slug, title, description, hero_image)
    VALUES (${slug}, ${title}, ${description}, ${hero_image})
    RETURNING id, slug, title, description, hero_image, created_at
  `;
  return NextResponse.json(inserted[0], { status: 201 });
}
