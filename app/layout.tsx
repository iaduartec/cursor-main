import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
// import { StackProvider, StackTheme } from '@stackframe/stack';
import Header from '../components/header';
import Footer from '../components/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Forzar renderizado dinámico para evitar problemas con Stack Auth
export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: 'Duartec Instalaciones Informáticas - Burgos',
    template: '%s | Duartec Instalaciones Informáticas',
  },
  description:
    'Instalación y mantenimiento de informática, videovigilancia, sonido, electricidad y cableados en Burgos y Castilla y León. Soluciones integrales para empresas y particulares.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // <StackProvider
    //   appId={process.env.NEXT_PUBLIC_STACK_PROJECT_ID!}
    //   publishableClientKey={process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!}
    //   secretServerKey={process.env.STACK_SECRET_SERVER_KEY!}
    // >
    //   <StackTheme>
    <html lang='es' className={inter.variable}>
      <body className='font-sans bg-white text-primary dark:bg-slate-900 dark:text-white min-h-screen flex flex-col'>
        <Header />
        <main className='flex-grow'>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
    //   </StackTheme>
    // </StackProvider>
  );
}
