import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Prefer standard Vercel Postgres var; fallback to DATABASE_URL if set locally
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
  },
} satisfies Config;

