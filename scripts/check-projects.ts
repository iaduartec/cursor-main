/**
Resumen generado automáticamente.

scripts/check-projects.ts

2025-09-13T06:20:07.383Z

——————————————————————————————
Archivo .ts: check-projects.ts
Tamaño: 244 caracteres, 10 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { getAllProjects } from '../lib/db-projects.new';

(async () => {
  const projects = await getAllProjects();
  console.log('projects count:', projects.length);
  if (projects.length > 0) {
    console.log(projects.slice(0,3));
  }
})();
