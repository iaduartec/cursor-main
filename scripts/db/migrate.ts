import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
// Load .env.local first if present, then fall back to .env
const envLocal = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal });
dotenv.config();

async function run() {
  console.log('Applying database migrations from ./drizzle ...');

  const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing POSTGRES_URL/POSTGRES_URL_NON_POOLING/DATABASE_URL for migrations');
  }
  const { migrate } = await import('drizzle-orm/node-postgres/migrator');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: 'drizzle' });
  await pool.end();

  console.log('Migrations applied successfully');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
