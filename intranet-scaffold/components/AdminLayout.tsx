import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({
  children,
  title,
  description,
}: AdminLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <Link href='/admin' className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
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
                <div>
                  <h1 className='text-lg font-semibold text-gray-900'>
                    Duartec Admin
                  </h1>
                  <p className='text-xs text-gray-500'>Sistema de gestión</p>
                </div>
              </Link>
            </div>

            <nav className='flex items-center space-x-4'>
              <Link
                href='/admin'
                className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Dashboard
              </Link>
              <Link
                href='/logout'
                className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
                Salir
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          {/* Page Header */}
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
            {description && (
              <p className='mt-2 text-sm text-gray-600'>{description}</p>
            )}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
