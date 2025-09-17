export default function TestPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Página de Prueba
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Si puedes ver esto, React está funcionando correctamente.
        </p>
        <a
          href="/blog/bienvenido-duartec"
          className="inline-block mt-4 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Ir al Blog
        </a>
      </div>
    </div>
  );
}