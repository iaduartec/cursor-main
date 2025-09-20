import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    include: ['__tests__/**/*.ts', '__tests__/**/*.tsx', 'tests/**/*.ts', 'tests/**/*.tsx'],
    exclude: ['tests/e2e/**', 'intranet-scaffold/**', 'playwright-report/**'],
  },
});
