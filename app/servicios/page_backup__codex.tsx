import { Metadata } from 'next';
import Link from 'next/link';
import { Monitor, Camera, Volume2, Zap, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Servicios - Duartec Instalaciones Informáticas',
  description: 'Servicios de informática, videovigilancia, sonido y electricidad en Burgos. Instalación, mantenimiento y soporte técnico profesional.',
};

export default function ServiciosPage() {
  const servicios = [
    {
      id: 'informatica',
      title: 'Informática',
      description: 'Equipos, redes, soporte y mantenimiento para tu empresa o negocio. Soluciones a medida.',
      icon: Monitor,
      color: 'blue',
      href: '/servicios/informatica'
    },
    {
      id: 'videovigilancia',
      title: 'Videovigilancia (CCTV)',
      description: 'Instalación y gestión de sistemas de videovigilancia y seguridad para tu tranquilidad.',
      icon: Camera,
      color: 'green',
      href: '/servicios/videovigilancia'
    },
    {
      id: 'sonido',
      title: 'Sonido Profesional',
      description: 'Soluciones de audio profesional para eventos, locales comerciales y espacios públicos.',
      icon: Volume2,
      color: 'purple',
      href: '/servicios/sonido'
    },
    {
      id: 'electricidad',
      title: 'Electricidad',
      description: 'Instalaciones eléctricas, cableados y soluciones energéticas para todo tipo de espacios.',
      icon: Zap,
      color: 'yellow',
      href: '/servicios/electricidad'
    },
    {
      id: 'baja-tension',
      title: 'Instalaciones Eléctricas BT',
      description: 'Baja tensión: cuadros, cableado, iluminación y certificación REBT para viviendas y locales.',
      icon: Zap,
      color: 'yellow',
      href: '/servicios/electricidad-baja-tension'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Soluciones integrales en instalaciones informáticas, videovigilancia, sonido y electricidad. 
            Calidad profesional garantizada en Burgos y Castilla y León.
          </p>
        </div>
      </section>

      {/* Servicios Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicios.map((servicio) => {
            const IconComponent = servicio.icon;
            return (
              <div key={servicio.id} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
                <div className={`w-16 h-16 bg-${servicio.color}-100 dark:bg-${servicio.color}-900 rounded-lg flex items-center justify-center mb-6`}>
                  <IconComponent className={`w-8 h-8 text-${servicio.color}-600`} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary dark:text-white">
                  {servicio.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {servicio.description}
                </p>
                <Link 
                  href={servicio.href}
                  className="inline-flex items-center text-accent hover:text-accent-700 font-semibold transition-colors"
                >
                  Ver detalles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas un presupuesto personalizado?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contacta con nosotros para recibir una propuesta adaptada a tus necesidades
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Solicitar presupuesto
          </Link>
        </div>
      </section>
    </div>
  );
}
