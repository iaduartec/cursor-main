<<<<<<< ours
<<<<<<< ours
import Image from 'next/image';
import { Monitor, Camera, Volume2, Zap, Shield, Clock, Users, MapPin, Phone } from 'lucide-react';
=======
=======
'use client';

import { Monitor, Camera, Volume2, Zap, Shield, Clock, Users, MapPin, Phone } from 'lucide-react';
>>>>>>> theirs
import dynamic from 'next/dynamic';
>>>>>>> theirs
import type { Metadata } from 'next';
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
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Soluciones integrales en informática, videovigilancia, sonido y electricidad
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Instalación, mantenimiento y asesoramiento profesional para empresas y particulares en Burgos y Castilla y León.
            Calidad, experiencia y cercanía garantizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Phone className="w-5 h-5 mr-2" />
              Solicita información
            </a>
            <a
              href="/servicios"
              className="inline-flex items-center justify-center bg-white dark:bg-slate-800 text-primary dark:text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 border border-gray-200 dark:border-slate-600"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ofrecemos soluciones completas en instalaciones informáticas, videovigilancia, sonido y electricidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Monitor className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Informática</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Equipos, redes, soporte y mantenimiento para tu empresa o negocio. Soluciones a medida.
            </p>
            <a href="/servicios/informatica" className="text-accent hover:underline font-medium">
              Saber más →
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Videovigilancia (CCTV)</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instalación y gestión de sistemas de videovigilancia y seguridad para tu tranquilidad.
            </p>
            <a href="/servicios/videovigilancia" className="text-accent hover:underline font-medium">
              Saber más →
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sonido Profesional</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instalaciones de audio para eventos, comercios y espacios públicos. Sonido de calidad.
            </p>
            <a href="/servicios/sonido" className="text-accent hover:underline font-medium">
              Saber más →
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Electricidad y Cableados</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Instalaciones eléctricas, cableados estructurados y soluciones de conectividad para cualquier entorno.
            </p>
            <a href="/servicios/electricidad" className="text-accent hover:underline font-medium">
              Saber más →
            </a>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-gray-50 dark:bg-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir Duartec?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Más de 10 años de experiencia en el sector con un equipo de profesionales cualificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Trabajamos con los mejores materiales y equipos del mercado, garantizando la máxima calidad en todas nuestras instalaciones.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Atención inmediata y soporte técnico disponible 24/7 para emergencias. Tu tranquilidad es nuestra prioridad.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experiencia Local</h3>
              <p className="text-gray-600 dark:text-gray-300">
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

