import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

// Prefer pooled connection when POSTGRES_URL is provided (Vercel recommended)
// Fallback to direct connection using pg Pool when only NON_POOLING/DATABASE_URL is available
const pooledUrl = process.env.POSTGRES_URL;
const directUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

if (pooledUrl) {
  // Uses Vercel pooled client under the hood
  // @vercel/postgres reads POSTGRES_URL automatically
  // eslint-disable-next-line import/no-named-as-default-member
  // Create DB via vercel-postgres adapter
  // Drizzle DB instance using Vercel Postgres pooled connection
  // Exported as default db
}

export const db = pooledUrl
  ? drizzleVercel(sql)
  : (() => {
      if (!directUrl) {
        throw new Error('Missing POSTGRES_URL or POSTGRES_URL_NON_POOLING/DATABASE_URL env variables');
      }
      const pool = new Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
      return drizzlePg(pool);
    })();
