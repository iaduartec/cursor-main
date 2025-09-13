import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET() {
  try {
    // Only allowed when the in-memory DB is active
    if (!(process.env.USE_IN_MEMORY_DB === '1' || process.env.USE_IN_MEMORY_DB === 'true')) {
      return NextResponse.json({ error: 'Debug endpoint only available in in-memory mode' }, { status: 403 });
    }
    const sql = getDb();
    // the adapter exposes __state for debugging
    const state = (sql && (sql as any).__state) || null;
    return NextResponse.json({ state });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal Error' }, { status: 500 });
  }
}
