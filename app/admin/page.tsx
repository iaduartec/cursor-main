import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Forzar renderizado del lado del cliente para evitar errores de prerenderizado
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // Comprobación server-side: si ya hay sesión, redirigir al panel admin
  try {
    const { userId } = await auth();
    if (userId) {
      // Usuario autenticado: redirigir al panel (por ejemplo /admin/posts)
      redirect('/admin/posts');
    }
  } catch (err) {
    // En caso de error, continuar y mostrar el formulario de login
    // (no hacemos throw para no romper la página)
    // eslint-disable-next-line no-console
    console.error('Error comprobando sesión Clerk en /admin:', err);
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
          <SignIn
            path='/admin'
            routing='path'
            signUpUrl='/admin/signup'
            redirectUrl='/admin'
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-md font-medium transition-colors',
                card: 'shadow-none bg-transparent p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formFieldInput:
                  'dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder-gray-400',
                formFieldLabel: 'dark:text-white font-medium',
                footerActionText: 'dark:text-gray-400 text-sm',
                footerActionLink:
                  'text-blue-600 hover:text-blue-700 font-medium',
                formFieldInputShowPasswordButton: 'dark:text-gray-400',
                dividerLine: 'dark:bg-slate-600',
                dividerText: 'dark:text-gray-400',
                socialButtonsBlockButton:
                  'w-full border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700',
                socialButtonsBlockButtonText: 'font-medium',
                alert:
                  'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded',
                alertText: 'text-red-700 dark:text-red-400',
              },
              layout: {
                socialButtonsPlacement: 'bottom',
                socialButtonsVariant: 'blockButton',
              },
            }}
          />
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
