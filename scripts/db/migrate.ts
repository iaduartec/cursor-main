import 'dotenv/config';

async function run() {
  console.log('Applying database migrations from ./drizzle ...');

  if (process.env.POSTGRES_URL) {
    const { migrate } = await import('drizzle-orm/vercel-postgres/migrator');
    const { drizzle } = await import('drizzle-orm/vercel-postgres');
    const { sql } = await import('@vercel/postgres');
    const db = drizzle(sql);
    await migrate(db, { migrationsFolder: 'drizzle' });
  } else {
    const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing POSTGRES_URL (pooled) or POSTGRES_URL_NON_POOLING/DATABASE_URL for direct connection');
    }
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: 'drizzle' });
    await pool.end();
  }

  console.log('Migrations applied successfully');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
