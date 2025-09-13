/**
Resumen generado automáticamente.

intranet-scaffold/playwright.config.ts

2025-09-13T06:20:07.376Z

——————————————————————————————
Archivo .ts: playwright.config.ts
Tamaño: 605 caracteres, 28 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
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
    reuseExistingServer: false,
  },
});
