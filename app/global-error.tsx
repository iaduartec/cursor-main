'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Error Crítico
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Ha ocurrido un error crítico en la aplicación. Por favor, recarga la página.
              </p>
            </div>
            
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); reset(); }}
              className="inline-flex items-center justify-center w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Recargar página
            </a>
            
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>Si el problema persiste, contacta con nosotros:</p>
              <a 
                href="mailto:info@duartec.es" 
                className="text-accent hover:underline"
              >
                info@duartec.es
              </a>
              {error.digest && (
                <p className="mt-2 text-xs">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
