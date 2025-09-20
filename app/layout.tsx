<<<<<<< HEAD
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Inter } from 'next/font/google';
=======
/**
Resumen generado automáticamente.

app/layout.tsx

2025-09-13T06:20:07.363Z

——————————————————————————————
Archivo .tsx: layout.tsx
Tamaño: 3466 caracteres, 103 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import './globals.css';
import './browser-compatibility.css';
import 'leaflet/dist/leaflet.css';
// import { Inter } from 'next/font/google';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { ReactNode } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

<<<<<<< HEAD
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
=======
// Temporarily using system font due to network restrictions
// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const inter = { variable: '--font-inter', className: '' };
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

export const metadata = {
  title: {
    default: 'Duartec Instalaciones Informáticas - Burgos',
    template: '%s | Duartec Instalaciones Informáticas',
  },
  description:
    'Instalación y mantenimiento de informática, videovigilancia, sonido, electricidad y cableados en Burgos y Castilla y León. Soluciones integrales para empresas y particulares.',
  keywords: [
    'informática burgos',
    'videovigilancia burgos',
    'sonido profesional burgos',
    'electricidad burgos',
    'mantenimiento informático',
    'soporte técnico burgos',
    'instalaciones informáticas',
    'CCTV burgos',
    'redes informáticas',
    'Duartec'
  ],
  authors: [{ name: 'Duartec Instalaciones Informáticas' }],
  creator: 'Duartec Instalaciones Informáticas',
  publisher: 'Duartec Instalaciones Informáticas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://duartec.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Duartec Instalaciones Informáticas - Burgos',
    description: 'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',
    url: 'https://duartec.es',
    siteName: 'Duartec Instalaciones Informáticas',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Duartec Instalaciones Informáticas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duartec Instalaciones Informáticas - Burgos',
    description: 'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',
    images: ['/og-image.jpg'],
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
    google: 'tu-codigo-verificacion-google',
  },
  icons: {
    icon:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e3a8a"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(%23g)"/><path fill="white" d="M20 42h8l4-8 4 8h8L34 18h-4z"/></svg>',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
<<<<<<< HEAD
=======
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
      </head>
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
      <body className="font-sans bg-white text-primary dark:bg-slate-900 dark:text-white min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded z-50">
          Saltar al contenido principal
        </a>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="outline-none focus-visible:ring-2 focus-visible:ring-accent flex-grow"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
