import { db } from '../db/client';

// Detecta si hay configuración de base de datos disponible en el entorno.
// Soporta nombres estándar y también los prefijos `cxz_` usados en .env local.
export const hasDb = () => Boolean(
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.cxz_POSTGRES_URL ||
  process.env.cxz_POSTGRES_PRISMA_URL ||
  process.env.cxz_POSTGRES_URL_NON_POOLING
);

export async function withDb<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!hasDb()) {
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return fallback;
  }
}
