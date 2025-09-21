// scripts/db/migrate-neon.ts
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { logger: true });

  await migrate(db, { migrationsFolder: 'drizzle' });
  console.warn('✅ Migraciones aplicadas');
}

main().catch(err => {
  console.error('❌ Error migrando:', err);
  process.exit(1);
});
