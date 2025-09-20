// Minimal tRPC stub used for local type-checking and simple dev runs.
// This file intentionally provides lightweight helpers matching the
// shape used across the app. Replace with real tRPC initialization when
// integrating a production backend.

type RouterDefinition = Record<string, unknown>;

export function createTRPCRouter<TDef extends RouterDefinition>(def: TDef): TDef;
export function createTRPCRouter(): RouterDefinition;
export function createTRPCRouter(def: RouterDefinition = {}) {
  return def;
}

type ProcedureHandler<TResult = unknown> = (...args: unknown[]) => TResult;

interface ProcedureChain {
  input(): ProcedureChain;
  query<THandler extends ProcedureHandler>(fn?: THandler): THandler | undefined;
  mutation<THandler extends ProcedureHandler>(fn?: THandler): THandler | undefined;
}

const baseProcedure: ProcedureChain = {
  input: () => baseProcedure,
  query: (fn) => fn,
  mutation: (fn) => fn,
};

export const publicProcedure: ProcedureChain = baseProcedure;

export const protectedProcedure = publicProcedure;

export default null;
