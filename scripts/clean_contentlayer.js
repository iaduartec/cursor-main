#!/usr/bin/env node
<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

scripts/clean_contentlayer.js

2025-09-13T06:20:07.384Z

——————————————————————————————
Archivo .js: clean_contentlayer.js
Tamaño: 567 caracteres, 25 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
// Remove stale Contentlayer artifacts to avoid stale indexes during builds.
// This is safe on Vercel and local. Ignore errors if the folder doesn't exist.

const fs = require('fs');
const path = require('path');

const targets = [
  path.resolve('.contentlayer'),
];

for (const p of targets) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`[clean] removed ${p}`);
    }
  } catch (e) {
    console.warn(`[clean] failed to remove ${p}: ${e && e.message}`);
  }
}

process.exit(0);

