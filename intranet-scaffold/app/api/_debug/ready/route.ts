import { NextResponse } from 'next/server'

// Simple readiness endpoint used by automated tests.
export async function GET() {
  const useInMemory = process.env.USE_IN_MEMORY_DB === '1' || process.env.USE_IN_MEMORY_DB === 'true'
  return NextResponse.json({ status: 'ok', inMemoryDb: useInMemory, timestamp: Date.now() }, { status: 200 })
}
