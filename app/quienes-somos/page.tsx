import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Award, MapPin, Clock, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quiénes Somos - Duartec Instalaciones Informáticas',
  description: 'Conoce a Duartec, empresa de instalaciones informáticas en Burgos con más de 10 años de experiencia en el sector.',
};

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
            Quiénes Somos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Más de 10 años de experiencia en instalaciones informáticas, videovigilancia, sonido y electricidad en Burgos y Castilla y León.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-primary dark:text-white">Nuestra Historia</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Duartec nació en 2013 con la misión de ofrecer servicios de instalación y mantenimiento informático de alta calidad en Burgos y su provincia.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Desde nuestros inicios, hemos crecido hasta convertirnos en una empresa de referencia en el sector, ampliando nuestros servicios a videovigilancia, sonido profesional y electricidad.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Nuestro compromiso con la calidad, la innovación y la atención al cliente nos ha permitido mantener una posición de liderazgo en el mercado local.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary dark:text-white">10+</h3>
                <p className="text-gray-600 dark:text-gray-300">Años de experiencia</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary dark:text-white">500+</h3>
                <p className="text-gray-600 dark:text-gray-300">Clientes satisfechos</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary dark:text-white">1000+</h3>
                <p className="text-gray-600 dark:text-gray-300">Proyectos completados</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary dark:text-white">50km</h3>
                <p className="text-gray-600 dark:text-gray-300">Radio de servicio</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-semibold">Dónde estamos</p>
              <p>AVDA. Valencia del Cid, 3 - Bajo, Burgos (España)</p>
              <p className="mt-2">Email: info@duartec.es · Tel: 947 000 000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-gray-50 dark:bg-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo y relación con los clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Trabajamos con los mejores materiales y equipos del mercado, garantizando la máxima calidad en todas nuestras instalaciones.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Puntualidad</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Respetamos los plazos acordados y nos comprometemos a entregar los proyectos en tiempo y forma.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Atención Personalizada</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cada cliente es único. Ofrecemos soluciones adaptadas a las necesidades específicas de cada proyecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Equipo</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Profesionales cualificados y con amplia experiencia en el sector
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-white">Técnicos Certificados</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Nuestro equipo cuenta con certificaciones oficiales de los principales fabricantes del sector.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-white">Experiencia Comprobada</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Más de una década de experiencia en instalaciones y mantenimiento de sistemas tecnológicos.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-white">Soporte Continuo</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Atención técnica disponible las 24 horas para emergencias y mantenimiento preventivo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Quieres trabajar con nosotros?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contacta con nosotros para conocer más sobre nuestros servicios y solicitar un presupuesto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contactar ahora
            </Link>
            <a
              href="tel:+34947256430"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors duration-200"
            >
              Llamar: 947 256 430
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
