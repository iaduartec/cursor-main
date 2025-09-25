// scripts/guard-pm.mjs
// Evita instalaciones con npm/yarn accidentalmente y exige pnpm

const pm = process.env.npm_config_user_agent || '';
const isPNPM = pm.includes('pnpm');
if (!isPNPM) {
  console.error('\n[guard-pm] Este repositorio usa pnpm. Por favor ejecuta:');
  console.error('  corepack enable');
  console.error('  pnpm i');
  process.exit(1);
}
/**
Resumen generado automáticamente.

scripts/guard-pm.mjs

2025-09-13T06:20:07.386Z

——————————————————————————————
Archivo .mjs: guard-pm.mjs
Tamaño: 428 caracteres, 14 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// Permite relajar validaciones en CI (p. ej. Vercel aún usa pnpm 9.x)
const isVercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);
const isCI = process.env.CI === 'true' || process.env.CONTINUOUS_INTEGRATION === 'true';
const allowRelaxed = isVercel || isCI;

const contextLabel = isVercel ? 'Vercel' : isCI ? 'CI' : 'local';

function warn(message) {
  console.warn(`⚠️ [guard-pm:${contextLabel}] ${message}`);
}

function fail(primary, secondary) {
  console.error(`❌ ${primary}`);
  if (secondary) {
    console.error(`💡 ${secondary}`);
  }
  process.exit(1);
}

// Bloquea gestor: exige pnpm >=10 <11 (evita versiones antiguas y futuras incompatibles)
const ua = process.env.npm_config_user_agent || '';
const pnpmMatch = ua.match(/pnpm\/(\d+)\.(\d+)\.(\d+)/);
if (!pnpmMatch) {
  if (allowRelaxed) {
    warn(`User agent pnpm no detectado (${ua || 'desconocido'}). Continuando por entorno CI.`);
  } else {
    fail(`Usa pnpm 10.x. Detectado: ${ua || 'desconocido'}`, 'Instala pnpm 10.x para continuar.');
  }
} else {
  const pnpmMajor = Number(pnpmMatch[1]);
  if (!(pnpmMajor >= 10 && pnpmMajor < 11)) {
    if (allowRelaxed && pnpmMajor >= 9 && pnpmMajor < 10) {
      warn(`Detectado pnpm ${pnpmMajor}.x. Se permite temporalmente en CI, pero actualiza a 10.x cuanto antes.`);
    } else {
      fail(
        `Usa pnpm >=10 <11. Detectado: ${ua}`,
        'Instala pnpm 10.x (se aceptan 10.*; se bloquean <10 y >=11).',
      );
    }
  }
}

// Bloquea versión de Node: exige 22.x o superior (no permite versiones antiguas)
const major = Number(process.versions.node.split('.')[0]);
if (major < 22) {
  if (allowRelaxed && major >= 20) {
    warn(`Node ${process.versions.node} detectado. Continua el build, pero se recomienda 22.x o superior.`);
  } else {
    fail(
      `Usa Node 22.x o superior. Detectado: ${process.versions.node}`,
      'Actualiza Node.js a la versión 22.x o superior para continuar.',
    );
  }
}

