import { Metadata } from 'next';

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
