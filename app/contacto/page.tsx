import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto - Duartec Instalaciones Informáticas',
  description: 'Contacta con Duartec para instalaciones de informática, videovigilancia, sonido y electricidad en Burgos. Presupuestos sin compromiso.',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ¿Necesitas una instalación o mantenimiento? Contacta con nosotros para un presupuesto personalizado sin compromiso.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Envíanos un mensaje</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="947 256 430"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="servicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servicio de interés
                </label>
                <select
                  id="servicio"
                  name="servicio"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="informatica">Informática</option>
                  <option value="videovigilancia">Videovigilancia</option>
                  <option value="sonido">Sonido Profesional</option>
                  <option value="electricidad">Electricidad</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Describe tu proyecto o consulta..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary dark:text-white">Teléfono</h3>
                    <p className="text-gray-600 dark:text-gray-300">947 256 430</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emergencias 24/7</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">info@duartec.es</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Respuesta en 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary dark:text-white">Zona de servicio</h3>
                    <p className="text-gray-600 dark:text-gray-300">Burgos y provincia</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Castilla y León</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary dark:text-white">Horario</h3>
                    <p className="text-gray-600 dark:text-gray-300">Lunes - Viernes: 9:00 - 18:00</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emergencias 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6">
              <h3 className="font-semibold text-lg text-primary dark:text-white mb-4">¿Por qué elegirnos?</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Más de 10 años de experiencia</li>
                <li>• Respuesta rápida y profesional</li>
                <li>• Presupuestos sin compromiso</li>
                <li>• Garantía en todos nuestros trabajos</li>
                <li>• Atención personalizada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
