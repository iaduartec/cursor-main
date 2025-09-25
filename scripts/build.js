// scripts/build.js
// Objetivo: preparar entorno antes de next build, sin ejecutar el build aquí (package.json ya llama build:next)
// - Desactiva telemetría
// - En Windows local (no CI/Vercel), permite saltar Contentlayer por defecto para evitar fricciones
// - Ejecuta prebuild (validaciones/normalizaciones previas)

const { spawnSync } = require('node:child_process');
const os = require('node:os');

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (res.status !== 0) {
    const code = res.status ?? 1;
    console.error(`[build.js] Falló: ${cmd} ${args.join(' ')} (exit=${code})`);
    process.exit(code);
  }
}

function main() {
  const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS || process.env.VERCEL);
  const isWindows = process.platform === 'win32';

  // Telemetría fuera por defecto
  process.env.NEXT_TELEMETRY_DISABLED = process.env.NEXT_TELEMETRY_DISABLED || '1';

  // En Windows local, favorecer builds sin Contentlayer si no se especifica lo contrario
  if (!isCI && isWindows && !process.env.SKIP_CONTENTLAYER) {
    process.env.SKIP_CONTENTLAYER = '1';
  }

  // NODE_ENV production para build
  process.env.NODE_ENV = 'production';

  console.log('[build.js] Entorno: ', {
    platform: process.platform,
    isCI,
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED,
    SKIP_CONTENTLAYER: process.env.SKIP_CONTENTLAYER || '0',
  });

  // Ejecutar prebuild si existe
  run('pnpm', ['run', 'prebuild']);

  // No ejecutamos next build aquí; lo hace package.json con "&& pnpm run build:next"
  console.log('[build.js] Prebuild completado. Continuará con build:next desde package.json...');
}

main();
