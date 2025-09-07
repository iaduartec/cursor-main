import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

// Drizzle DB instance using Vercel Postgres connection from env
export const db = drizzle(sql);

