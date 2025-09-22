import './globals.css';import './globals.css';

import 'leaflet/dist/leaflet.css';import 'leaflet/dist/leaflet.css';

import { Inter } from 'next/font/google';import { Inter } from 'next/font/g        <Header />

import { ReactNode } from 'react';        <main

import { Analytics } from '@vercel/analytics/next';          id='main-content'

import { SpeedInsights } from '@vercel/speed-insights/next';          tabIndex={-1}

import Header from '../components/header';          className='outline-none focus-visible:ring-2 focus-visible:ring-accent flex-grow'

import Footer from '../components/footer';        >

          {children}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });        </main>

        <Footer />port { ReactNode } from 'react';

export const metadata = {import { Analytics } from '@vercel/analytics/next';

  title: {import { SpeedInsights } from '@vercel/speed-insights/next';

    default: 'Duartec Instalaciones Informáticas - Burgos',import Header from '../components/header';

    template: '%s | Duartec Instalaciones Informáticas',import Footer from '../components/footer';

  },

  description:const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

    'Instalación y mantenimiento de informática, videovigilancia, sonido, electricidad y cableados en Burgos y Castilla y León. Soluciones integrales para empresas y particulares.',

  keywords: [export const metadata = {

    'informática burgos',  title: {

    'videovigilancia burgos',    default: 'Duartec Instalaciones Informáticas - Burgos',

    'sonido profesional burgos',    template: '%s | Duartec Instalaciones Informáticas',

    'electricidad burgos',  },

    'mantenimiento informático',  description:

    'soporte técnico burgos',    'Instalación y mantenimiento de informática, videovigilancia, sonido, electricidad y cableados en Burgos y Castilla y León. Soluciones integrales para empresas y particulares.',

    'instalaciones informáticas',  keywords: [

    'CCTV burgos',    'informática burgos',

    'redes informáticas',    'videovigilancia burgos',

    'Duartec',    'sonido profesional burgos',

  ],    'electricidad burgos',

  authors: [{ name: 'Duartec Instalaciones Informáticas' }],    'mantenimiento informático',

  creator: 'Duartec Instalaciones Informáticas',    'soporte técnico burgos',

  publisher: 'Duartec Instalaciones Informáticas',    'instalaciones informáticas',

  formatDetection: {    'CCTV burgos',

    email: false,    'redes informáticas',

    address: false,    'Duartec',

    telephone: false,  ],

  },  authors: [{ name: 'Duartec Instalaciones Informáticas' }],

  metadataBase: new URL('https://duartec.es'),  creator: 'Duartec Instalaciones Informáticas',

  alternates: {  publisher: 'Duartec Instalaciones Informáticas',

    canonical: '/',  formatDetection: {

  },    email: false,

  openGraph: {    address: false,

    title: 'Duartec Instalaciones Informáticas - Burgos',    telephone: false,

    description:  },

      'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',  metadataBase: new URL('https://duartec.es'),

    url: 'https://duartec.es',  alternates: {

    siteName: 'Duartec Instalaciones Informáticas',    canonical: '/',

    locale: 'es_ES',  },

    type: 'website',  openGraph: {

    images: [    title: 'Duartec Instalaciones Informáticas - Burgos',

      {    description:

        url: '/og-image.jpg',      'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',

        width: 1200,    url: 'https://duartec.es',

        height: 630,    siteName: 'Duartec Instalaciones Informáticas',

        alt: 'Duartec Instalaciones Informáticas',    locale: 'es_ES',

      },    type: 'website',

    ],    images: [

  },      {

  twitter: {        url: '/og-image.jpg',

    card: 'summary_large_image',        width: 1200,

    title: 'Duartec Instalaciones Informáticas - Burgos',        height: 630,

    description:        alt: 'Duartec Instalaciones Informáticas',

      'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',      },

    images: ['/og-image.jpg'],    ],

  },  },

  robots: {  twitter: {

    index: true,    card: 'summary_large_image',

    follow: true,    title: 'Duartec Instalaciones Informáticas - Burgos',

    googleBot: {    description:

      index: true,      'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',

      follow: true,    images: ['/og-image.jpg'],

      'max-video-preview': -1,  },

      'max-image-preview': 'large',  robots: {

      'max-snippet': -1,    index: true,

    },    follow: true,

  },    googleBot: {

  verification: {      index: true,

    google: 'tu-codigo-verificacion-google',      follow: true,

  },      'max-video-preview': -1,

  icons: {      'max-image-preview': 'large',

    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e3a8a"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(%23g)"/><path fill="white" d="M20 42h8l4-8 4 8h8L34 18h-4z"/></svg>',      'max-snippet': -1,

  },    },

};  },

  verification: {

export default function RootLayout({ children }: { children: ReactNode }) {    google: 'tu-codigo-verificacion-google',

  return (  },

    <html lang='es' className={inter.variable}>  icons: {

      <body className='font-sans bg-white text-primary dark:bg-slate-900 dark:text-white min-h-screen flex flex-col'>    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e3a8a"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(%23g)"/><path fill="white" d="M20 42h8l4-8 4 8h8L34 18h-4z"/></svg>',

        <a  },

          href='#main-content'};

          className='skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded z-50'

        >export default function RootLayout({ children }: { children: ReactNode }) {

          Saltar al contenido principal  return (

        </a>    <html lang='es' className={inter.variable}>

        <Header />      <body className='font-sans bg-white text-primary dark:bg-slate-900 dark:text-white min-h-screen flex flex-col'>

        <main        <Providers>

          id='main-content'          <a

          tabIndex={-1}            href='#main-content'

          className='outline-none focus-visible:ring-2 focus-visible:ring-accent flex-grow'            className='skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded z-50'

        >          >

          {children}            Saltar al contenido principal

        </main>          </a>

        <Footer />          <Header />

        {/* Vercel Analytics & Speed Insights */}          <main

        <Analytics />            id='main-content'

        <SpeedInsights />            tabIndex={-1}

      </body>            className='outline-none focus-visible:ring-2 focus-visible:ring-accent flex-grow'

    </html>          >

  );            {children}

}          </main>
          <Footer />
        </Providers>
        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
