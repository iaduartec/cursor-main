import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon, type NeonSql } from '@neondatabase/serverless'

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL/POSTGRES_URL no definidos')
  }
  const sql = neon(url) as NeonSql
  const rows = await sql`select now() as now, version() as v`
  console.log(rows)
  if (typeof sql.end === 'function') {
    await sql.end()
  }
}
main().catch((e) => { console.error(e); process.exit(1) })

