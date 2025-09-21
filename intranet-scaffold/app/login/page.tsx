import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams?.error === '1';
  const redirectTo = (searchParams?.redirect as string) || '/admin';

  async function loginAction(formData: FormData) {
    'use server';

    const token = formData.get('token') as string;

    if (!token) {
      redirect('/login?error=1');
    }

    // Verificar token
    const expectedToken =
      process.env.INTRANET_DEBUG_TOKEN || process.env.ADMIN_TOKEN;
    if (!expectedToken || token !== expectedToken) {
      redirect('/login?error=1');
    }

    // Establecer cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set('intranet_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    // Redirigir al destino original o al admin
    redirect(redirectTo);
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <div className='mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100'>
            <svg
              className='h-6 w-6 text-blue-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Acceso a Intranet
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Sistema de administración Duartec
          </p>
        </div>

        <form className='mt-8 space-y-6' action={loginAction}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='token' className='sr-only'>
                Token de acceso
              </label>
              <input
                id='token'
                name='token'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Ingresa tu token de acceso'
              />
            </div>
          </div>

          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-red-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>
                    Token inválido
                  </h3>
                  <div className='mt-2 text-sm text-red-700'>
                    <p>El token de acceso proporcionado no es válido.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg
                  className='h-5 w-5 text-blue-500 group-hover:text-blue-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              Acceder al sistema
            </button>
          </div>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              Sistema seguro de gestión de contenido
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
