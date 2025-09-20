import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent-400">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al inicio
          </Link>
          
          <a
            href="javascript:history.back()"
            className="inline-flex items-center justify-center w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver atrás
          </a>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>¿Necesitas ayuda? Contacta con nosotros:</p>
          <a 
            href="mailto:info@duartec.es" 
            className="text-accent hover:underline"
          >
            info@duartec.es
          </a>
        </div>
      </div>
    </div>
  );
}
