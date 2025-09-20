<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

app/servicios/informatica/page.tsx

2025-09-13T06:20:07.366Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 8348 caracteres, 184 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Server, Wifi, Shield, Settings, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Servicios de Informática - Duartec Instalaciones Informáticas',
  description: 'Servicios de informática en Burgos: instalación de equipos, redes, mantenimiento y soporte técnico para empresas y particulares.',
};

export default function InformaticaPage() {
  const servicios = [
    {
      icon: Monitor,
      title: 'Instalación de Equipos',
      description: 'Montaje y configuración de ordenadores, servidores y periféricos para empresas y particulares.',
      features: ['Equipos de sobremesa', 'Portátiles', 'Servidores', 'Impresoras y escáneres']
    },
    {
      icon: Wifi,
      title: 'Redes y Conectividad',
      description: 'Instalación y configuración de redes WiFi, cableadas y sistemas de conectividad.',
      features: ['Redes WiFi empresariales', 'Cableado estructurado', 'Switches y routers', 'Puntos de acceso']
    },
    {
      icon: Server,
      title: 'Servidores y Almacenamiento',
      description: 'Configuración de servidores, sistemas de backup y soluciones de almacenamiento.',
      features: ['Servidores Windows/Linux', 'Sistemas NAS', 'Backup automático', 'Virtualización']
    },
    {
      icon: Shield,
      title: 'Seguridad Informática',
      description: 'Implementación de medidas de seguridad para proteger tu infraestructura IT.',
      features: ['Antivirus empresarial', 'Firewalls', 'Cortafuegos', 'Auditorías de seguridad']
    },
    {
      icon: Settings,
      title: 'Mantenimiento y Soporte',
      description: 'Servicios de mantenimiento preventivo y soporte técnico continuo.',
      features: ['Mantenimiento preventivo', 'Soporte remoto', 'Reparaciones', 'Actualizaciones']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/proyectos/Informática.jpeg"
            alt="Servicios de Informática"
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
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
              Servicios de Informática
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Soluciones informáticas completas para empresas y particulares. Instalación, mantenimiento y soporte técnico profesional en Burgos.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Detallados */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio) => {
            const IconComponent = servicio.icon;
            return (
              <div key={servicio.title} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600" />
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
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Por qué elegirnos para informática */}
      <section className="bg-gray-50 dark:bg-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegirnos para tus servicios informáticos?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Más de 10 años de experiencia en el sector con un equipo de técnicos cualificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Técnicos Certificados</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nuestro equipo cuenta con certificaciones oficiales de los principales fabricantes del sector.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Atención técnica disponible las 24 horas para emergencias y mantenimiento preventivo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soluciones a Medida</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cada proyecto es único. Adaptamos nuestras soluciones a las necesidades específicas de tu empresa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas servicios informáticos?
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
