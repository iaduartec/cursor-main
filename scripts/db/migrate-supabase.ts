/**
 * scripts/db/migrate-supabase.ts
 * Modified to be tolerant when no DATABASE_URL/POSTGRES_URL is present (CI/static deploys)
 */
import { config } from 'dotenv'
config({ path: '.env.local' }) // 👈 fuerza .env.local
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

async function main() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!url) {
    console.warn('⚠️  No POSTGRES_URL or DATABASE_URL found in .env.local — skipping DB migrations')
    return
  }

  const sql = postgres(url, { prepare: false })
  const db = drizzle(sql, { logger: true })

  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('✅ Migraciones aplicadas a Supabase')
  } catch (err: any) {
    // Treat 'relation already exists' errors (42P07) as a non-fatal warning.
    const code = err?.cause?.code || err?.code || err?.cause?.severity || null
    if (code === '42P07' || /already exists/i.test(String(err?.message || ''))) {
      console.warn('⚠️  Warning during migrations: some relations already exist. Continuing.');
    } else {
      throw err
    }
  } finally {
    await sql.end()
  }
}

main().catch((err) => {
  console.error('❌ Error migrando:', err)
  process.exit(1)
})

