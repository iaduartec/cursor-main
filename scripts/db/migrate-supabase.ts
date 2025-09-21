#!/usr/bin/env tsx
/**
 * scripts/db/migrate-supabase.ts
 * Versión segura que no falla el build cuando no existen vars de BD.
 * Si se detecta POSTGRES_URL/DATABASE_URL intentará aplicar la migración
 * (misma lógica que la versión en intranet-scaffold). En entornos sin DB
 * simplemente hace un exit 0 para que Vercel/CI no interrumpa el build.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

async function main() {
  const databaseUrl =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.cxz_POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  if (!databaseUrl) {
    console.warn(
      '⚠️  No database URL found in environment. Skipping DB migrations (safe for Vercel builds).'
    );
    return;
  }

  const sql = postgres(databaseUrl, { ssl: 'require' });

  // try possible locations for the SQL migration
  const candidate1 = path.resolve(
    process.cwd(),
    'intranet-scaffold',
    'drizzle',
    'migrations',
    '0001_init.sql'
  );
  const candidate2 = path.resolve(
    process.cwd(),
    'drizzle',
    'migrations',
    '0001_init.sql'
  );

  let migrationPath = '';
  if (fs.existsSync(candidate1)) {
    migrationPath = candidate1;
  } else if (fs.existsSync(candidate2)) {
    migrationPath = candidate2;
  } else {
    console.error('Migration SQL not found. Checked:', candidate1, candidate2);
    await sql.end({ timeout: 5 }).catch(() => {});
    process.exit(1);
  }

  const sqlText = fs.readFileSync(migrationPath, 'utf8');
  console.log('Applying migration:', migrationPath);
  try {
    await sql.unsafe(sqlText);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    await sql.end({ timeout: 5 }).catch(() => {});
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 }).catch(() => {});
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
