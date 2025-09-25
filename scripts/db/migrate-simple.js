// scripts/db/migrate-simple.js
// Propósito: ejecutar migraciones de Drizzle con la mejor opción disponible.
// - Si tsx está disponible: usar el script TS principal (migrate.ts)
// - Si no: intentar el JS seguro (migrate-safe.ts via tsx si existe)
// - Si no hay opciones: no fallar duro en entornos locales sin TSX, solo avisar

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

function hasCmd(cmd) {
  const which = process.platform === 'win32' ? 'where' : 'which';
  const res = spawnSync(which, [cmd], { stdio: 'ignore', shell: true });
  return res.status === 0;
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  return res.status ?? 1;
}

function main() {
  const root = process.cwd();
  const tsxAvailable = hasCmd('tsx');
  const tsMigrate = path.join('scripts', 'db', 'migrate.ts');
  const tsSafe = path.join('scripts', 'db', 'migrate-safe.ts');

  if (tsxAvailable && existsSync(tsMigrate)) {
    const code = run('tsx', [tsMigrate]);
    if (code !== 0) {
      if (process.env.CI) {
        process.exit(code);
      } else {
        console.warn('[migrate-simple] Error ejecutando migrate.ts con tsx. Saltando en entorno local.');
        process.exit(0);
      }
    }
    process.exit(0);
  }

  if (tsxAvailable && existsSync(tsSafe)) {
    const code = run('tsx', [tsSafe]);
    if (code !== 0) {
      if (process.env.CI) {
        process.exit(code);
      } else {
        console.warn('[migrate-simple] Error ejecutando migrate-safe.ts con tsx. Saltando en entorno local.');
        process.exit(0);
      }
    }
    process.exit(0);
  }

  console.warn('[migrate-simple] tsx no disponible o scripts TS no encontrados. Saltando migraciones.');
  process.exit(0);
}

main();
