import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Supabase connection string
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
  },
} satisfies Config;

