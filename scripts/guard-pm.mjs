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
// Bloquea gestor: exige pnpm >=10 <11 (evita versiones antiguas y futuras incompatibles)
const ua = process.env.npm_config_user_agent || "";
const pnpmMatch = ua.match(/pnpm\/(\d+)\.(\d+)\.(\d+)/);
if (!pnpmMatch) {
  console.error(`❌ Usa pnpm 10.x. Detectado: ${ua || "desconocido"}`);
  console.error(`💡 Instala pnpm 10.x para continuar.`);
  process.exit(1);
}
const pnpmMajor = Number(pnpmMatch[1]);
if (!(pnpmMajor >= 10 && pnpmMajor < 11)) {
  console.error(`❌ Usa pnpm >=10 <11. Detectado: ${ua}`);
  console.error(`💡 Instala pnpm 10.x (se aceptan 10.*; se bloquean <10 y >=11).`);
  process.exit(1);
}
// Bloquea versión de Node: exige 22.x o superior (no permite versiones antiguas)
const major = Number(process.versions.node.split(".")[0]);
if (major < 22) {
  console.error(`❌ Usa Node 22.x o superior. Detectado: ${process.versions.node}`);
  console.error(`💡 Actualiza Node.js a la versión 22.x o superior para continuar.`);
  process.exit(1);
}

