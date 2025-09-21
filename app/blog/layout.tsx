import { Metadata } from 'next';
<<<<<<< HEAD
=======
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog - Duartec Instalaciones Informáticas',
  description: 'Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias del sector.',
  keywords: 'blog, electricidad, informática, sonido, videovigilancia, consejos técnicos, instalaciones',
  openGraph: {
    title: 'Blog Técnico - Duartec',
    description: 'Artículos técnicos especializados sobre instalaciones informáticas',
    type: 'website',
  },
};

export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog - Duartec Instalaciones Informáticas',
  description: 'Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias del sector.',
  keywords: 'blog, electricidad, informática, sonido, videovigilancia, consejos técnicos, instalaciones',
  openGraph: {
    title: 'Blog Técnico - Duartec',
    description: 'Artículos técnicos especializados sobre instalaciones informáticas',
    type: 'website',
  },
};

export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog - Duartec Instalaciones Informáticas',
  description: 'Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias del sector.',
  keywords: 'blog, electricidad, informática, sonido, videovigilancia, consejos técnicos, instalaciones',
  openGraph: {
    title: 'Blog Técnico - Duartec',
    description: 'Artículos técnicos especializados sobre instalaciones informáticas',
    type: 'website',
  },
};

export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = { 
  title: 'Blog - Duartec Instalaciones Informáticas',
  description: 'Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias del sector.',
  keywords: 'blog, electricidad, informática, sonido, videovigilancia, consejos técnicos, instalaciones',
  openGraph: {
    title: 'Blog Técnico - Duartec',
    description: 'Artículos técnicos especializados sobre instalaciones informáticas',
    type: 'website',
  },
};

export function BlogLayout({ children }: { children: ReactNode }) { 
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
// Removed duplicate imports and definitions

// Removed duplicate metadata
// Removed duplicate title
// Removed duplicate description
// Removed duplicate keywords
// Removed duplicate openGraph
// Removed duplicate openGraph title
// Removed duplicate openGraph description
// Removed duplicate openGraph type
// Removed duplicate closing brace
// Removed duplicate closing brace

// Removed duplicate ReactNode import

// Removed duplicate BlogLayout function
// Removed duplicate return statement
// Removed duplicate div
// Removed duplicate children
// Removed duplicate closing div
// Removed duplicate closing brace
// Removed duplicate closing brace
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog - Duartec Instalaciones Informáticas',
  description: 'Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias del sector.',
  keywords: 'blog, electricidad, informática, sonido, videovigilancia, consejos técnicos, instalaciones',
  openGraph: {
    title: 'Blog Técnico - Duartec',
    description: 'Artículos técnicos especializados sobre instalaciones informáticas',
    type: 'website',
  },
};

export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
import { Metadata } from 'next';
>>>>>>> 3457dd6 (Limpieza definitiva: solo bloque funcional mínimo en blog)

export const metadata: Metadata = {
  title: 'Blog - Duartec Instalaciones Informáticas',
  description: 'Artículos técnicos especializados sobre electricidad, informática, sonido y videovigilancia. Consejos profesionales y tendencias del sector.',
  keywords: 'blog, electricidad, informática, sonido, videovigilancia, consejos técnicos, instalaciones',
  openGraph: {
    title: 'Blog Técnico - Duartec',
    description: 'Artículos técnicos especializados sobre instalaciones informáticas',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {children}
    </div>
  );
}
