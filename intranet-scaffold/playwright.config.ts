import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'pnpm dev',
    cwd: path.resolve(__dirname),
    env: {
      USE_IN_MEMORY_DB: '1',
      INTRANET_DEBUG_TOKEN: 'test-token',
    },
    timeout: 60_000,
    reuseExistingServer: true,
  },
});
