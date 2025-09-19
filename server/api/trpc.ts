// Minimal tRPC stub used for local type-checking and simple dev runs.
// This file intentionally provides lightweight, 'any'-typed helpers
// matching the shape used across the app. Replace with real tRPC
// initialization when integrating full tRPC backend.

// Intentionally lightweight tRPC stub for local dev and type-checking.
// We keep the runtime shape permissive but avoid spreading `any` into
// function signatures where `unknown` suffices. Callers that rely on the
// precise tRPC typing should replace this file with a real tRPC init.
/* eslint-disable @typescript-eslint/no-explicit-any */
export function createTRPCRouter(def: unknown = {}) {
  // Keep the returned shape `any`-typed for the rest of the app while
  // preventing callers from passing through `any` inadvertently.
  return def as any;
}

export const publicProcedure: any = {
  // A very small adapter that allows `.input()`/`.query()` chains in code
  input() {
    return publicProcedure;
  },
  query(fn?: unknown) {
    return fn as any;
  },
  mutation(fn?: unknown) {
    return fn as any;
  },
};

export const protectedProcedure = publicProcedure;

export default null as any;
/* eslint-enable @typescript-eslint/no-explicit-any */
