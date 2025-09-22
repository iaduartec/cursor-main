import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Crear Cuenta
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Regístrate para acceder al panel de administración
          </p>
        </div>

        <SignUp
          path='/admin/signup'
          routing='path'
          signInUrl='/admin/login'
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
