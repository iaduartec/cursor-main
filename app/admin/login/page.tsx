import { SignIn } from '@clerk/nextjs';

// Forzar renderizado del lado del cliente para evitar errores de prerenderizado
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Acceso Admin
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Inicia sesión para acceder al panel de administración
          </p>
        </div>

        <SignIn
          path='/admin/login'
          routing='path'
          signUpUrl='/admin/signup'
          redirectUrl='/admin'
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              card: 'shadow-lg border border-gray-200 dark:border-slate-700',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              formFieldInput: 'dark:bg-slate-900 dark:border-slate-600',
              formFieldLabel: 'dark:text-white',
              footerActionText: 'dark:text-gray-400',
              footerActionLink: 'text-blue-600 hover:text-blue-700',
            },
            layout: {
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            },
          }}
        />
      </div>
    </div>
  );
}
