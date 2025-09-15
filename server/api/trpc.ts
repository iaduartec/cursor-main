// Minimal tRPC stub used for local type-checking and simple dev runs.
// This file intentionally provides lightweight, 'any'-typed helpers
// matching the shape used across the app. Replace with real tRPC
// initialization when integrating full tRPC backend.

export function createTRPCRouter(def: any = {}) {
  return def as any;
}

export const publicProcedure: any = {
  // A very small adapter that allows `.input()`/`.query()` chains in code
  input() { return publicProcedure; },
  query(fn?: any) { return fn; },
  mutation(fn?: any) { return fn; },
};

export const protectedProcedure = publicProcedure;

export default null as any;
