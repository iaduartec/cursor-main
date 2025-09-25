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
  keywords: [
    'instalaciones informáticas',
    'videovigilancia',
    'sonido profesional', 
    'electricidad',
    'cableado estructurado',
    'Burgos',
    'Castilla y León',
    'mantenimiento informático',
    'seguridad',
    'CCTV'
  ],
  authors: [{ name: 'Duartec Instalaciones Informáticas' }],
  creator: 'Duartec Instalaciones Informáticas',
  publisher: 'Duartec Instalaciones Informáticas',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.duartec.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'Duartec Instalaciones Informáticas',
    title: 'Duartec Instalaciones Informáticas - Burgos',
    description: 'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',
    images: [
      {
        url: '/images/og-default.webp',
        width: 1200,
        height: 630,
        alt: 'Duartec Instalaciones Informáticas - Burgos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@duartec_es',
    creator: '@duartec_es',
    title: 'Duartec Instalaciones Informáticas - Burgos',
    description: 'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',
    images: ['/images/og-default.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-256x256.png',
  },
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
