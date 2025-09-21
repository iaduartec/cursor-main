declare module 'drizzle-kit' {
  export type Config = Record<string, unknown>;
}

declare module 'vitest' {
  export const expect: {
    extend: (...args: unknown[]) => void;
  };
  export const afterEach: (fn: () => void) => void;
  export const vi: Record<string, unknown>;
}

declare module 'vitest/config' {
  export const defineConfig: (...args: unknown[]) => unknown;
}

declare module '@testing-library/jest-dom/matchers' {
  export const toBeInTheDocument: unknown;
  export default unknown;
}

declare module '@testing-library/react' {
  export const cleanup: () => void;
}
