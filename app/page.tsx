/**
Resumen generado automáticamente.

app/page.tsx

2025-09-13T06:20:07.364Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 16337 caracteres, 341 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import Image from 'next/image';
import type { Metadata } from 'next';
import { Monitor, Camera, Volume2, Zap, Shield, Clock, Users, MapPin, Phone } from 'lucide-react';
import MapCamarasClient from '../components/MapCamaras.client';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Duartec Instalaciones Informáticas - Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',
  openGraph: {
    title: 'Duartec Instalaciones Informáticas - Burgos',
    description:
      'Soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos y Castilla y León.',
  },
};

export default function Page() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/10 dark:from-slate-800 dark:to-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" aria-hidden="true" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Soluciones integrales en{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              informática, videovigilancia, sonido y electricidad
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Instalación, mantenimiento y asesoramiento profesional para empresas y particulares en Burgos y Castilla y León.
            Calidad, experiencia y cercanía garantizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              Solicita información
            </a>
            <a
              href="/servicios"
              className="inline-flex items-center justify-center bg-white dark:bg-slate-700 text-primary dark:text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Nuestros Servicios</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ofrecemos soluciones completas en instalaciones informáticas, videovigilancia, sonido y electricidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Monitor className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Informática</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Equipos, redes, soporte y mantenimiento para tu empresa o negocio. Soluciones a medida.
            </p>
            <a href="/servicios/informatica" className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 transition-colors">
              Saber más →
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Camera className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Videovigilancia (CCTV)</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instalación y gestión de sistemas de videovigilancia y seguridad para tu tranquilidad.
            </p>
            <a href="/servicios/videovigilancia" className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 transition-colors">
              Saber más →
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Volume2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Sonido Profesional</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instalaciones de audio para eventos, comercios y espacios públicos. Sonido de calidad.
            </p>
            <a href="/servicios/sonido" className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 transition-colors">
              Saber más →
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Electricidad y Cableados</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instalaciones eléctricas, cableados estructurados y soluciones de conectividad para cualquier entorno.
            </p>
            <a href="/servicios/electricidad" className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 transition-colors">
              Saber más →
            </a>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-gray-50 dark:bg-slate-800 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">¿Por qué elegir Duartec?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Más de 10 años de experiencia en el sector con un equipo de profesionales cualificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white dark:bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calidad Garantizada</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Trabajamos con los mejores materiales y equipos del mercado, garantizando la máxima calidad en todas nuestras instalaciones.
              </p>
            </div>

            <div className="text-center bg-white dark:bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Respuesta Rápida</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Atención inmediata y soporte técnico disponible 24/7 para emergencias. Tu tranquilidad es nuestra prioridad.
              </p>
            </div>

            <div className="text-center bg-white dark:bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Experiencia Local</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Conocemos las necesidades específicas de Burgos y Castilla y León. Atención personalizada y cercana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa interactivo de Burgos */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Mapa Interactivo</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ubicación de nuestras cámaras en la provincia de Burgos. Pulsa en un punto para abrir la emisión.
          </p>
        </div>
        <MapCamarasClient />
      </section>

      {/* Cámaras en directo 24h */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Cámaras de Streaming 24 horas</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Acceso directo a nuestras cámaras en pueblos de Burgos. Diseño tipo galería, rápido y visual.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { href: '/streaming/silos', name: 'Santo Domingo de Silos', youtubeId: 'czwL7LgjyjU' },
            { href: '/streaming/rabanera-del-pinar', name: 'Rabanera del Pinar', youtubeId: '2FLLNsHmgxc' },
            { href: '/streaming/pineda-de-la-sierra', name: 'Pineda de la Sierra', youtubeId: 'MqU3cNr22XQ' },
            { href: '/streaming/huerta-de-arriba', name: 'Huerta de Arriba', youtubeId: 'Kv2HeXZXWaw' },
          ].map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="group rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow hover:shadow-lg transition-all"
            >
              <div className="relative h-40">
                <Image
                  src={`https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg`}
                  alt={c.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">EN DIRECTO</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary dark:text-white group-hover:text-accent transition-colors line-clamp-1">{c.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">En directo 24/7</p>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/streaming" className="inline-block text-accent hover:underline font-semibold">Ver todas las cámaras →</a>
        </div>
      </section>

      {/* Zona de servicio */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Zona de Servicio</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Cubrimos toda la provincia de Burgos y alrededores</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="w-8 h-8 text-accent mr-3" />
            <h3 className="text-2xl font-semibold">Burgos y Provincia</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <strong>Burgos Capital</strong>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <strong>Miranda de Ebro</strong>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <strong>Aranda de Duero</strong>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <strong>Briviesca</strong>
            </div>
          </div>
          <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
            Y todas las localidades de la provincia. Consulta disponibilidad en tu zona.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesitas una instalación o mantenimiento?</h2>
          <p className="text-xl mb-8 opacity-90">Contacta con nosotros para un presupuesto personalizado sin compromiso</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contactar ahora
            </a>
            <a
              href="tel:+34947256430"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors duration-200"
            >
              <Phone className="w-5 h-5 mr-2" />
              Llamar: 947 256 430
            </a>
          </div>
        </div>
      </section>

      {/* Datos estructurados JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Duartec Instalaciones Informáticas',
          description:
            'Instalación y mantenimiento de informática, videovigilancia, sonido, electricidad y cableados en Burgos y Castilla y León.',
          url: 'https://duartec.es',
          telephone: '+34947256430',
          email: 'info@duartec.es',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Burgos',
            addressRegion: 'Castilla y León',
            addressCountry: 'ES',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '42.3408',
            longitude: '-3.6997',
          },
          openingHours: 'Mo-Fr 09:00-18:00',
          priceRange: '€€',
          serviceArea: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: '42.3408',
              longitude: '-3.6997',
            },
            geoRadius: '50000',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios de Instalación',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Informática',
                  description: 'Instalación, mantenimiento y soporte informático',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Videovigilancia',
                  description: 'Sistemas de CCTV y seguridad',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Sonido Profesional',
                  description: 'Instalaciones de audio profesional',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Electricidad',
                  description: 'Instalaciones eléctricas y cableados',
                },
              },
            ],
          },
        })}
      </script>
    </>
  );
}

