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
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
    console.error('Global Error:', error);
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Error Crítico</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Ha ocurrido un error crítico en la aplicación. Por favor, recarga la página.</p>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Ha ocurrido un error cr
tico en la aplicaci
. Por favor, recarga la p
ina.
          </p>
        </div>
          Recargar página
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); reset(); }}
          className="inline-flex items-center justify-center w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Recargar p
ina
        </a>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Si el problema persiste, contacta con nosotros:</p>
          <a 
            href="mailto:info@duartec.es" 
            className="text-accent hover:underline"
          >
            info@duartec.es
          </a>
  );
}
            </p>
          )}
        </div>
      </div>
    </div>
  );
  );
}
