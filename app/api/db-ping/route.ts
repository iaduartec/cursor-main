import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sql } from '../../../db/client';

export async function GET(_req: NextRequest) {
  try {
    // Drizzle client exposes a low-level SQL client as `sql` in this repo
    const rows = await sql`select version() as version limit 1`;
    return NextResponse.json({ ok: true, version: rows });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
