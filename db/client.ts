import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Supabase connection
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

// Create postgres client for Drizzle
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// Also export Supabase client for additional functionality
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export { client as sql };
