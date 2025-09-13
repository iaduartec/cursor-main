import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

function checkDebugAccess(req: Request) {
  const token = process.env.INTRANET_DEBUG_TOKEN;
  if (token) {
    const provided = req.headers.get('x-debug-token') || '';
    if (provided !== token) return false;
    return true;
  }
  // If no token configured, only allow outside production
  if (process.env.NODE_ENV === 'production') return false;
  return true;
}

export async function GET(req: Request) {
  if (!checkDebugAccess(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
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
