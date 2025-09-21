import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout
      title='Panel de Administración'
      description='Gestiona el contenido de la web de Duartec desde un solo lugar'
    >
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Proyectos
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>--</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Servicios
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>--</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Posts
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>--</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-red-500 rounded-md flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Streams
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>--</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className='bg-white shadow rounded-lg mb-8'>
        <div className='px-4 py-5 sm:p-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
            Estado del Sistema
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-900'>
                  Base de Datos
                </p>
                <p className='text-sm text-gray-500'>
                  Conectado a Neon PostgreSQL
                </p>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-900'>
                  Autenticación
                </p>
                <p className='text-sm text-gray-500'>Sesión activa y segura</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className='bg-white shadow rounded-lg'>
        <div className='px-4 py-5 sm:p-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
            Herramientas de Gestión
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Proyectos */}
            <Link
              href='/admin/projects'
              className='relative block w-full bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors'>
                    <svg
                      className='w-6 h-6 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors'>
                    Proyectos
                  </h4>
                  <p className='text-sm text-gray-500'>
                    Gestionar proyectos y casos de éxito
                  </p>
                </div>
              </div>
              <div className='absolute top-6 right-6'>
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Link>

            {/* Servicios */}
            <Link
              href='/admin/services'
              className='relative block w-full bg-white border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors'>
                    <svg
                      className='w-6 h-6 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors'>
                    Servicios
                  </h4>
                  <p className='text-sm text-gray-500'>
                    Gestionar servicios ofrecidos
                  </p>
                </div>
              </div>
              <div className='absolute top-6 right-6'>
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Link>

            {/* Blog */}
            <Link
              href='/admin/blog'
              className='relative block w-full bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors'>
                    <svg
                      className='w-6 h-6 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors'>
                    Blog
                  </h4>
                  <p className='text-sm text-gray-500'>
                    Gestionar posts y artículos
                  </p>
                </div>
              </div>
              <div className='absolute top-6 right-6'>
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Link>

            {/* Streams */}
            <Link
              href='/admin/streaming'
              className='relative block w-full bg-white border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-md transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors'>
                    <svg
                      className='w-6 h-6 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors'>
                    Streaming
                  </h4>
                  <p className='text-sm text-gray-500'>
                    Gestionar transmisiones en vivo
                  </p>
                </div>
              </div>
              <div className='absolute top-6 right-6'>
                <svg
                  className='w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-8 bg-white shadow rounded-lg'>
        <div className='px-4 py-4 sm:px-6'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-500'>
              <p>Sistema de administración Duartec - Versión 1.0.0</p>
            </div>
            <div className='text-sm text-gray-500'>
              <p>
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
