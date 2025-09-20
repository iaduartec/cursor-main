/**
Resumen generado automáticamente.

intranet-scaffold/scripts/dev-no-contentlayer.js

2025-09-13T06:20:07.377Z

——————————————————————————————
Archivo .js: dev-no-contentlayer.js
Tamaño: 524 caracteres, 16 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// (Shebang removed; script invoked via `node` in package.json to avoid TS 18026 warning)
const { spawn } = require('child_process');

// Set env vars to reduce Contentlayer activity on Windows
process.env.CONTENTLAYER_SKIP_TYPEGEN = '1';
process.env.CONTENTLAYER_HIDE_WARNING = '1';
// Tell root config to skip applying Contentlayer wrapper
process.env.SKIP_CONTENTLAYER = '1';

const cmd = process.execPath; // node
const args = [require.resolve('next/dist/bin/next'), 'dev'];

const p = spawn(cmd, args, { stdio: 'inherit', env: process.env });

p.on('close', (code) => process.exit(code));
