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
    <html lang='es' className='__variable_f367f3'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Error Crítico - Duartec Instalaciones Informáticas</title>
        <meta
          name='description'
          content='Ha ocurrido un error en el sitio web. Por favor, intenta recargar la página.'
        />
      </head>
      <body className='font-sans bg-white text-primary dark:bg-slate-900 dark:text-white min-h-screen flex flex-col'>
        {/* Enlace de accesibilidad para saltar al contenido principal */}
        <a
          href='#main-content'
          className='skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded z-50'
        >
          Saltar al contenido principal
        </a>

        {/* Header simplificado para errores globales */}
        <header className='w-full bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-900 shadow-lg sticky top-0 z-50'>
          <div className='max-w-6xl mx-auto px-4 py-4'>
            <div className='flex items-center justify-center'>
              <div className='text-white text-center'>
                <div className='text-lg font-bold'>Duartec</div>
                <div className='text-sm text-gray-200'>
                  Instalaciones Informáticas
                </div>
              </div>
            </div>
          </div>
        </header>

        <main
          id='main-content'
          tabIndex={-1}
          className='outline-none focus-visible:ring-2 focus-visible:ring-accent flex-grow'
        >
          <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900'>
            <div className='max-w-md w-full text-center'>
              <div className='mb-8'>
                <div className='w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <AlertTriangle className='w-10 h-10 text-red-600 dark:text-red-400' />
                </div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                  Error Crítico
                </h1>
                <p className='text-gray-600 dark:text-gray-300 mb-8'>
                  Ha ocurrido un error crítico en la aplicación. Por favor,
                  recarga la página.
                </p>
              </div>

              <a
                href='#'
                onClick={e => {
                  e.preventDefault();
                  reset();
                }}
                className='inline-flex items-center justify-center w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200'
              >
                <RefreshCw className='w-5 h-5 mr-2' />
                Recargar página
              </a>

              <div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
                <p>Si el problema persiste, contacta con nosotros:</p>
                <a
                  href='mailto:info@duartec.es'
                  className='text-accent hover:underline'
                >
                  info@duartec.es
                </a>
                {error.digest && (
                  <p className='mt-2 text-xs'>Error ID: {error.digest}</p>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Footer simplificado para errores globales */}
        <footer className='w-full bg-slate-900 text-white'>
          <div className='max-w-6xl mx-auto py-6 px-4 text-center'>
            <p className='text-sm text-gray-400'>
              © 2025 Duartec Instalaciones Informáticas. Todos los derechos
              reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
