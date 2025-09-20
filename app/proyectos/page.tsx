<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/proyectos/page.tsx

2025-09-13T06:20:07.365Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 2690 caracteres, 59 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
<<<<<<< HEAD
import { getAllProjects } from '../../lib/db-projects';
=======
import { getAllProjects } from '../../lib/db-projects.new';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

export const metadata: Metadata = {
  title: 'Proyectos - Duartec Instalaciones Informáticas',
  description:
    'Proyectos realizados por Duartec en Burgos. Instalaciones de informática, videovigilancia, sonido y electricidad.',
};

export const dynamic = 'force-dynamic';

export default async function ProyectosPage() {
  const proyectos = await getAllProjects();
<<<<<<< HEAD
=======
  // Use fallback from contentlayer if DB query fails (handled inside getAllProjects)
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">Nuestros Proyectos</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre algunos de los proyectos más destacados que hemos realizado en Burgos y Castilla y León.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectos.map((p) => (
            <div key={p.slug} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700 overflow-hidden">
              {p.image && (
                <div className="relative h-40 w-full">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{p.category}</span>
<<<<<<< HEAD
                  <span>{p.date ? new Date(p.date as any).getFullYear() : ''}</span>
=======
                  <span>{p.date ? new Date(String(p.date)).getFullYear() : ''}</span>
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{p.description}</p>
                <Link href={`/proyectos/${p.slug}`} className="flex items-center text-accent hover:text-accent-700 text-sm font-medium transition-colors">
                  Ver detalles
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

