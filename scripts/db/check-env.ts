import { hasDb } from '../../lib/db-utils';

console.log('NODE_ENV =', process.env.NODE_ENV);
console.log('VERCEL =', process.env.VERCEL);
console.log('ENABLE_DB_IN_DEV =', process.env.ENABLE_DB_IN_DEV);
console.log('FORCE_DB_CONNECT =', process.env.FORCE_DB_CONNECT);
console.log('POSTGRES_URL =', !!process.env.POSTGRES_URL);
console.log('DATABASE_URL =', !!process.env.DATABASE_URL);
// Note: SUPABASE_DB_URL is a deprecated fallback for legacy deployments and
// should not be relied upon for new setups. We avoid printing deprecated
// secret variables to reduce accidental leakage.
console.log('cxz_POSTGRES_URL =', !!process.env.cxz_POSTGRES_URL);
console.log('hasDb() =', hasDb());
