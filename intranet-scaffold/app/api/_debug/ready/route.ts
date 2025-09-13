import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/db'

// Readiness endpoint used by automated tests. If USE_IN_MEMORY_DB is set,
// returns inMemoryDb=true. Otherwise attempts a lightweight DB check (SELECT 1).
export async function GET() {
  const useInMemory = process.env.USE_IN_MEMORY_DB === '1' || process.env.USE_IN_MEMORY_DB === 'true'
  if (useInMemory) {
    return NextResponse.json({ status: 'ok', inMemoryDb: true, timestamp: Date.now() }, { status: 200 })
  }

  try {
    const sql = getDb();
    // run a minimal check
    try {
      // postgres client returns number rows or similar; we only care it resolves
      await sql`SELECT 1`;
      return NextResponse.json({ status: 'ok', inMemoryDb: false, timestamp: Date.now() }, { status: 200 })
    } catch (e: any) {
      return NextResponse.json({ status: 'unavailable', error: String(e) }, { status: 503 })
    }
  } catch (err: any) {
    return NextResponse.json({ status: 'missing-config', error: String(err) }, { status: 503 })
  }
}
