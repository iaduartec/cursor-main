import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET() {
  try {
    // If in-memory adapter is active, check its state
    try {
      const sql = getDb();
      if (sql && (sql as any).__state) {
        return NextResponse.json({ ready: true });
      }
      // Otherwise try a lightweight query against the real DB
      const res = await sql`SELECT 1`;
      return NextResponse.json({ ready: true, result: res });
    } catch (e) {
  return NextResponse.json({ ready: false, error: String(e) }, { status: 503 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal Error' }, { status: 500 });
  }
}
