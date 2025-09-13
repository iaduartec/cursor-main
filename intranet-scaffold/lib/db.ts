import postgres from "postgres";

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.cxz_POSTGRES_URL;
let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!sql) {
    if (!dbUrl) throw new Error("Database URL not configured. Set SUPABASE_DB_URL or DATABASE_URL.");
    sql = postgres(dbUrl, { ssl: 'require' });
  }
  return sql;
}

export async function closeDb() {
  if (sql) {
    await sql.end({ timeout: 5 });
    sql = null;
  }
}
