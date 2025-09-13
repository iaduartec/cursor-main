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
// Bloquea gestor: exige pnpm 9.6.0
const ua = process.env.npm_config_user_agent || "";
if (!ua.includes("pnpm/9.6.0")) {
  console.error(`❌ Usa pnpm 9.6.0. Detectado: ${ua || "desconocido"}`);
  process.exit(1);
}
// Bloquea versión de Node: exige 22.x
const major = Number(process.versions.node.split(".")[0]);
if (major !== 22) {
  console.error(`❌ Usa Node 22.x. Detectado: ${process.versions.node}`);
  process.exit(1);
}

