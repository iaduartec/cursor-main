/**
Resumen generado automáticamente.

intranet-scaffold/app/admin/page.tsx

2025-09-13T06:20:07.373Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 510 caracteres, 14 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
export default function AdminPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Panel</h1>
      <p>Accede a las herramientas de administración:</p>
      <ul>
        <li><a href="/admin/projects">CRUD Proyectos (crear / editar / borrar)</a></li>
        <li>Otras secciones: Servicios, Streams y Blog (próximamente)</li>
      </ul>
      <p style={{ marginTop: 12, color: '#666' }}>La interfaz evita confirmaciones bloqueantes para facilitar E2E y automatización.</p>
    </main>
  );
}
