<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/blog/layout.tsx

2025-09-13T06:20:07.362Z

——————————————————————————————
Archivo .tsx: layout.tsx
Tamaño: 756 caracteres, 25 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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
