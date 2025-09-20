<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/servicios/videovigilancia/page.tsx

2025-09-13T06:20:07.366Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 5754 caracteres, 134 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Shield, Eye, Smartphone, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Videovigilancia y CCTV - Duartec Instalaciones Informáticas',
  description: 'Sistemas de videovigilancia y CCTV en Burgos. Instalación de cámaras de seguridad, control remoto y monitorización 24/7.',
};

export default function VideovigilanciaPage() {
  const servicios = [
    {
      icon: Camera,
      title: 'Instalación de Cámaras',
      description: 'Montaje y configuración de sistemas de videovigilancia adaptados a tus necesidades.',
      features: ['Cámaras IP', 'Cámaras analógicas', 'Cámaras domo', 'Cámaras bullet']
    },
    {
      icon: Eye,
      title: 'Monitorización 24/7',
      description: 'Sistemas de grabación y monitorización continua para máxima seguridad.',
      features: ['Grabación continua', 'Detección de movimiento', 'Almacenamiento en la nube', 'Backup automático']
    },
    {
      icon: Smartphone,
      title: 'Control Remoto',
      description: 'Acceso a tu sistema de seguridad desde cualquier dispositivo móvil.',
      features: ['App móvil', 'Acceso web', 'Notificaciones push', 'Control remoto']
    },
    {
      icon: Shield,
      title: 'Sistemas de Alarma',
      description: 'Integración con sistemas de alarma para protección completa.',
      features: ['Sensores de movimiento', 'Sirenas', 'Conexión con central', 'Verificación por video']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/proyectos/CCTV.jpeg"
            alt="Servicios de Videovigilancia y CCTV"
            layout="fill"
            objectFit="cover"
            className="opacity-10"
          />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Link 
              href="/servicios"
              className="flex items-center text-accent hover:text-accent-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a servicios
            </Link>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
              Videovigilancia y CCTV
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sistemas de seguridad y videovigilancia profesionales. Protege tu negocio o vivienda con la mejor tecnología disponible.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Detallados */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicios.map((servicio) => {
            const IconComponent = servicio.icon;
            return (
              <div key={servicio.title} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary dark:text-white">
                  {servicio.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {servicio.description}
                </p>
                <ul className="space-y-2">
                  {servicio.features.map((feature) => (
                    <li key={`${servicio.title}:${feature}`} className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas un sistema de videovigilancia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contacta con nosotros para un presupuesto personalizado sin compromiso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Solicitar presupuesto
            </Link>
            <a
              href="tel:+34947256430"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors duration-200"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
