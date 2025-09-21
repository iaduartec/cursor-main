import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies | Duartec Instalaciones Informáticas',
  description: 'Política de cookies y tecnologías de seguimiento utilizadas en el sitio web de Duartec Instalaciones Informáticas.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-accent hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Política de Cookies</span>
        </nav>

        {/* Botón de regreso */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-accent hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Contenido */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Cookies</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. ¿Qué son las cookies?</h2>
              <p className="text-gray-700 mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet, smartphone) cuando visita un sitio web. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga que volver a introducirlos cada vez que visite el sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Tipos de cookies que utilizamos</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Cookies técnicas (necesarias)</h3>
                <p className="text-gray-700 mb-3">
                  Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar en nuestros sistemas. Generalmente solo se establecen en respuesta a acciones realizadas por usted que equivalen a una solicitud de servicios, como establecer sus preferencias de privacidad, iniciar sesión o completar formularios.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>next-auth.session-token:</strong> Para gestionar la sesión del usuario</li>
                  <li><strong>next-auth.csrf-token:</strong> Para protección CSRF</li>
                  <li><strong>__Host-next-auth.csrf-token:</strong> Para protección CSRF segura</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Cookies de rendimiento</h3>
                <p className="text-gray-700 mb-3">
                  Estas cookies nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares y ver cómo los visitantes navegan por el sitio.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>_ga:</strong> Google Analytics - Análisis de tráfico web</li>
                  <li><strong>_gid:</strong> Google Analytics - Identificación de sesión</li>
                  <li><strong>_gat:</strong> Google Analytics - Limitación de tasa</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Cookies de funcionalidad</h3>
                <p className="text-gray-700 mb-3">
                  Estas cookies permiten que el sitio web proporcione funcionalidad y personalización mejoradas. Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios hemos agregado a nuestras páginas.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>theme-preference:</strong> Para recordar la preferencia de tema (claro/oscuro)</li>
                  <li><strong>language-preference:</strong> Para recordar el idioma preferido</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cookies de terceros</h2>
              <p className="text-gray-700 mb-4">
                Nuestro sitio web puede utilizar servicios de terceros que establecen sus propias cookies:
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Google Analytics</h3>
                <p className="text-gray-700 mb-3">
                  Utilizamos Google Analytics para analizar el uso de nuestro sitio web. Google Analytics recopila información sobre cómo utiliza nuestro sitio web, incluyendo su dirección IP. Esta información se utiliza para crear informes sobre el uso del sitio web.
                </p>
                <p className="text-gray-700 mb-3">
                  Para más información sobre las cookies de Google Analytics, visite: 
                  <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" 
                     className="text-accent hover:underline ml-1" 
                     target="_blank" 
                     rel="noopener noreferrer">
                    Google Analytics Cookie Usage
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Gestión de cookies</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Configuración del navegador</h3>
                <p className="text-gray-700 mb-3">
                  Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se está enviando una cookie. Sin embargo, si rechaza las cookies, es posible que algunas partes de nuestro sitio web no funcionen correctamente.
                </p>
                <p className="text-gray-700 mb-3">
                  Para obtener más información sobre cómo gestionar las cookies en su navegador, visite:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><a href="https://support.google.com/chrome/answer/95647" 
                          className="text-accent hover:underline" 
                          target="_blank" 
                          rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
                          className="text-accent hover:underline" 
                          target="_blank" 
                          rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" 
                          className="text-accent hover:underline" 
                          target="_blank" 
                          rel="noopener noreferrer">Internet Explorer</a></li>
                  <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
                          className="text-accent hover:underline" 
                          target="_blank" 
                          rel="noopener noreferrer">Safari</a></li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Desactivación de Google Analytics</h3>
                <p className="text-gray-700 mb-3">
                  Para desactivar Google Analytics, puede instalar el complemento del navegador de inhabilitación para Google Analytics. Para más información, visite: 
                  <a href="https://tools.google.com/dlpage/gaoptout" 
                     className="text-accent hover:underline ml-1" 
                     target="_blank" 
                     rel="noopener noreferrer">
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Duración de las cookies</h2>
              <p className="text-gray-700 mb-4">
                Las cookies pueden tener diferentes duraciones:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Cookies de sesión:</strong> Se eliminan automáticamente cuando cierra el navegador</li>
                <li><strong>Cookies persistentes:</strong> Permanecen en su dispositivo hasta que expiran o las elimina manualmente</li>
                <li><strong>Cookies de terceros:</strong> Su duración está determinada por el proveedor del servicio</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Actualizaciones de esta política</h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de actualizar esta política de cookies en cualquier momento. Cualquier cambio será publicado en esta página con una nueva fecha de &quot;última actualización&quot;. Le recomendamos que revise esta política periódicamente para estar informado sobre cómo utilizamos las cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tiene alguna pregunta sobre nuestra política de cookies, puede contactar con nosotros a través de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Email:</strong> info@duartec.es</li>
                <li><strong>Teléfono:</strong> 947 256 430</li>
                <li><strong>Dirección:</strong> Burgos, España</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
