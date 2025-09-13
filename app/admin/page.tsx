/**
Resumen generado automáticamente.

app/admin/page.tsx

2025-09-13T06:20:07.359Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 601 caracteres, 15 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
export default function AdminHome() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
      <ul className="list-disc ml-5 space-y-2">
        <li><a className="text-accent" href="/admin/posts">Gestionar Posts</a></li>
        <li><a className="text-accent" href="/admin/streams">Gestionar Cámaras</a></li>
        <li><a className="text-accent" href="/admin/services">Gestionar Servicios</a></li>
        <li><a className="text-accent" href="/admin/projects">Gestionar Proyectos</a></li>
      </ul>
    </div>
  );
}

