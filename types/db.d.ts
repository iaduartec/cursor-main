// Project-local low-level SQL client type placeholder.
// Replace the temporary `any` shim with the minimal callable contract
// used by the codebase so we can tighten typing without breaking
// runtime behavior.
// This covers the typical template-tag usage: `await sql` and
// ``await sql`SELECT ...` ``. It also includes a small subset of
// helpers some adapters expose (optional `end` and debug `__state`).
export type LowLevelSql = {
	// Template tag callable: supports template strings and returns a Promise
	// (the concrete adapter returns rows or query result objects).
	(strings: TemplateStringsArray, ...values: unknown[]): Promise<unknown>;

	// Some adapters expose an `end` method used to close a connection.
	end?: () => Promise<unknown>;

	// Adapter-specific debug/state field (in-memory adapter uses this).
	__state?: unknown;

	// Allow indexing to be permissive for other adapter-specific helpers used
	// in edge cases while we progressively tighten the contract.
	[k: string]: unknown;
};
