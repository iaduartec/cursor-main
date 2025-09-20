<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/admin/login/page.tsx

2025-09-13T06:20:07.359Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 637 caracteres, 12 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form method="POST" action="/api/admin/login" className="w-full max-w-sm bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-4">Acceso Admin</h1>
        <input name="token" type="password" placeholder="Token" className="w-full border rounded px-3 py-2 mb-4 dark:bg-slate-900" />
        <button type="submit" className="w-full bg-accent text-white rounded px-4 py-2">Entrar</button>
      </form>
    </div>
  );
}
