import { hasDb } from '../../lib/db-utils';

console.log('NODE_ENV =', process.env.NODE_ENV);
console.log('VERCEL =', process.env.VERCEL);
console.log('ENABLE_DB_IN_DEV =', process.env.ENABLE_DB_IN_DEV);
console.log('FORCE_DB_CONNECT =', process.env.FORCE_DB_CONNECT);
console.log('SUPABASE_DB_URL =', !!process.env.SUPABASE_DB_URL);
console.log('POSTGRES_URL =', !!process.env.POSTGRES_URL);
console.log('DATABASE_URL =', !!process.env.DATABASE_URL);
console.log('cxz_POSTGRES_URL =', !!process.env.cxz_POSTGRES_URL);
console.log('hasDb() =', hasDb());
