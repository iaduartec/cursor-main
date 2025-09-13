/**
Resumen generado automáticamente.

app/servicios/page.tsx

2025-09-13T06:20:07.366Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 4610 caracteres, 107 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { Metadata } from 'next';
import Link from 'next/link';
import { Monitor, Camera, Volume2, Zap, ArrowRight, type LucideIcon } from 'lucide-react';
import { getAllServices } from '../../lib/db-services';

export const metadata: Metadata = {
  title: 'Servicios - Duartec Instalaciones Informáticas',
  description:
    'Servicios de informática, videovigilancia, sonido y electricidad en Burgos. Instalación, mantenimiento y soporte técnico profesional.',
};

const iconBySlug: Record<string, { Icon: LucideIcon; bg: string; text: string }> = {
  informatica: { Icon: Monitor, bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600' },
  videovigilancia: { Icon: Camera, bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-600' },
  sonido: { Icon: Volume2, bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600' },
  electricidad: { Icon: Zap, bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-600' },
  'electricidad-baja-tension': { Icon: Zap, bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-600' },
};

type ServicioCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  bg: string;
  text: string;
};

export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const items = await getAllServices();
  const servicios: ServicioCard[] = items.map((s) => {
    const mapping = iconBySlug[s.slug] ?? { Icon: Monitor, bg: 'bg-gray-100 dark:bg-slate-700', text: 'text-gray-700' };
    return {
      id: s.slug,
      title: s.title,
      description: s.description || '',
      href: `/servicios/${s.slug}`,
      Icon: mapping.Icon,
      bg: mapping.bg,
      text: mapping.text,
    };
  });

  if (!servicios.find((s) => s.id === 'electricidad-baja-tension')) {
    const m = iconBySlug['electricidad-baja-tension'];
    servicios.push({
      id: 'electricidad-baja-tension',
      title: 'Instalaciones Eléctricas BT',
      description:
        'Baja tensión: cuadros, cableado, iluminación y certificación REBT para viviendas y locales.',
      href: '/servicios/electricidad-baja-tension',
      Icon: m.Icon,
      bg: m.bg,
      text: m.text,
    });
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">Nuestros Servicios</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Soluciones integrales en instalaciones informática, videovigilancia, sonido y electricidad. Calidad profesional
            garantizada en Burgos y Castilla y León.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700"
            >
              <div className={`w-16 h-16 ${servicio.bg} rounded-lg flex items-center justify-center mb-6`}>
                <servicio.Icon className={`w-8 h-8 ${servicio.text}`} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary dark:text-white">{servicio.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{servicio.description}</p>
              <Link href={servicio.href} className="inline-flex items-center text-accent hover:text-accent-700 font-semibold transition-colors">
                Ver detalles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesitas un presupuesto personalizado?</h2>
          <p className="text-xl mb-8 opacity-90">Contacta con nosotros para recibir una propuesta adaptada a tus necesidades</p>
          <Link href="/contacto" className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Solicitar presupuesto
          </Link>
        </div>
      </section>
    </div>
  );
}

