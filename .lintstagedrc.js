<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

.lintstagedrc.js

2025-09-13T06:20:07.353Z

——————————————————————————————
Archivo .js: .lintstagedrc.js
Tamaño: 339 caracteres, 18 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
module.exports = {
  // Formatear archivos de código
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix',
  ],
  
  // Formatear archivos de configuración y otros
  '*.{json,md,mdx,yml,yaml,css,scss}': [
    'prettier --write',
  ],
  
  // Verificar tipos de TypeScript
  '*.{ts,tsx}': [
    () => 'tsc --noEmit',
  ],
};
