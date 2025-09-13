import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET() {
  try {
    const envVal = process.env.USE_IN_MEMORY_DB;
    let usingInMemory = false;
    let hasState = false;
    try {
      if (envVal === '1' || envVal === 'true') {
        usingInMemory = true;
      }
      const sql = getDb();
      hasState = !!(sql && (sql as any).__state);
    } catch (e) {
      // getDb may throw if DB not configured; still return env info
    }
    return NextResponse.json({ USE_IN_MEMORY_DB: envVal ?? null, usingInMemory, hasState });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal Error' }, { status: 500 });
  }
}
