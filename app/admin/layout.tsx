import { ClerkProvider } from '@clerk/nextjs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className='min-h-screen grid grid-rows-[auto_1fr]'>
        <nav className='border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900'>
          <div className='max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center'>
            <a href='/admin' className='font-semibold'>
              Admin
            </a>
            <a href='/admin/posts' className='text-sm'>
              Posts
            </a>
            <a href='/admin/streams' className='text-sm'>
              Cámaras
            </a>
            <a href='/admin/services' className='text-sm'>
              Servicios
            </a>
            <a href='/admin/projects' className='text-sm'>
              Proyectos
            </a>
            <span className='ml-auto text-xs text-gray-500'>
              Protegido por Clerk
            </span>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </ClerkProvider>
  );
}
