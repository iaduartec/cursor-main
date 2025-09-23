import { SignIn, stackServerApp } from '@stackframe/stack';
import { redirect } from 'next/navigation';

// Forzar renderizado del lado del cliente para evitar errores de prerenderizado
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // Comprobación server-side: si ya hay sesión, redirigir al panel admin
  try {
    const user = await stackServerApp.getUser();
    if (user) {
      // Usuario autenticado: redirigir al panel (por ejemplo /admin/posts)
      redirect('/admin/posts');
    }
  } catch (err) {
    // En caso de error, continuar y mostrar el formulario de login
    // (no hacemos throw para no romper la página)
    // eslint-disable-next-line no-console
    console.error('Error comprobando sesión Stack en /admin:', err);
  }
  return (
    <div className='min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Acceso Admin
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Inicia sesión para acceder al panel de administración
          </p>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6'>
          <SignIn />
        </div>

        <div className='text-center mt-6'>
          <a
            href='/'
            className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            ← Volver al sitio web
          </a>
        </div>
      </div>
    </div>
  );
}
