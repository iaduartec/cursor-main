import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Single path using pg Pool (works locally and on Vercel)
const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing POSTGRES_URL or POSTGRES_URL_NON_POOLING/DATABASE_URL env variables');
}
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
export const db = drizzle(pool);
