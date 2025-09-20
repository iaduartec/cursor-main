<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/streaming/page.tsx

2025-09-13T06:20:07.367Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 2796 caracteres, 58 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { getAllStreams } from '../../lib/db-streams';
import { unstable_cache } from 'next/cache';

export const metadata: Metadata = {
  title: 'Streaming 24h - Cámaras en directo',
  description:
    'Cámaras en directo 24 horas desde pueblos de Burgos: Santo Domingo de Silos, Rabanera del Pinar, Pineda de la Sierra y Huerta de Arriba.',
};

const getStreams = unstable_cache(async () => await getAllStreams(), ['streams-index'], { revalidate: 3600, tags: ['streams'] });

export default async function StreamingIndexPage() {
  const cams = await getStreams();
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary dark:text-white">Cámaras en Directo 24h</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Accede a nuestras cámaras de streaming en pueblos de Burgos.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cams.map((c) => (
            <Link
              key={c.slug}
              href={`/streaming/${c.slug}`}
              className="group rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow hover:shadow-lg transition-all"
            >
              <div className="relative h-44">
                <Image
                  src={c.image || (c.youtubeId ? `https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg` : '/images/proyectos/CCTV.jpeg')}
                  alt={c.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">EN DIRECTO</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary dark:text-white group-hover:text-accent transition-colors line-clamp-1">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{c.provider === 'youtube' ? 'YouTube Live' : 'Live'}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
