import { db } from '../db/client';

export const hasDb = () => Boolean(
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.DATABASE_URL
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
