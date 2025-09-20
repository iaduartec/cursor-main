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

// Bloquea gestor: exige pnpm >=9 <11 (compatible con package.json pnpm@9.6.0)
const ua = process.env.npm_config_user_agent || '';
const pnpmMatch = ua.match(/pnpm\/(\d+)\.(\d+)\.(\d+)/);
if (!pnpmMatch) {
  if (allowRelaxed) {
    warn(`User agent pnpm no detectado (${ua || 'desconocido'}). Continuando por entorno CI.`);
  } else {
    fail(`Usa pnpm 9.x o 10.x. Detectado: ${ua || 'desconocido'}`, 'Instala pnpm 9.x o 10.x para continuar.');
  }
} else {
  const pnpmMajor = Number(pnpmMatch[1]);
  if (!(pnpmMajor >= 9 && pnpmMajor < 11)) {
    fail(
      `Usa pnpm >=9 <11. Detectado: ${ua}`,
      'Instala pnpm 9.x o 10.x (se aceptan 9.* y 10.*; se bloquean <9 y >=11).',
    );
  }
}

// Bloquea versión de Node: exige 22.x (compatible con package.json engines)
const major = Number(process.versions.node.split('.')[0]);
if (major !== 22) {
  if (allowRelaxed && major >= 20) {
    warn(`Node ${process.versions.node} detectado. Continua el build, pero se recomienda 22.x.`);
  } else {
    fail(
      `Usa Node 22.x. Detectado: ${process.versions.node}`,
      'Actualiza Node.js a la versión 22.x para continuar.',
    );
  }
}
