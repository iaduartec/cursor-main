import { NextRequest, NextResponse } from 'next/server';
import type { NeonSql } from '@neondatabase/serverless';
import { sql } from '../../../db/client';

export async function GET(_req: NextRequest) {
  try {
    // Drizzle client exposes a low-level SQL client as sql in this repo
    if (!sql) {
      return NextResponse.json(
        { ok: false, error: 'Database client not available' },
        { status: 500 }
      );
    }
    const query = sql as NeonSql<Record<string, unknown>>;
    const rows = await query`select version() as version limit 1`;
    return NextResponse.json({ ok: true, version: rows });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
