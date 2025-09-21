import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Condiciones de Uso | Duartec Instalaciones Informáticas',
  description: 'Condiciones de uso y términos de servicio del sitio web de Duartec Instalaciones Informáticas.',
};

export default function CondicionesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-accent hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Condiciones de Uso</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Condiciones de Uso</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceptación de las Condiciones</h2>
              <p className="text-gray-700 mb-4">
                Al acceder y utilizar este sitio web, usted acepta estar sujeto a estas condiciones de uso. Si no está de acuerdo con alguna parte de estas condiciones, no debe utilizar nuestro sitio web.
              </p>
              <p className="text-gray-700 mb-4">
                Estas condiciones se aplican a todos los visitantes, usuarios y otras personas que accedan o utilicen el sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Uso del Sitio Web</h2>
              <p className="text-gray-700 mb-4">
                Usted se compromete a utilizar el sitio web únicamente para fines legales y de una manera que no infrinja los derechos de otros usuarios o terceros. Específicamente, usted se compromete a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>No utilizar el sitio web de manera que cause, o pueda causar, daño al sitio web o deterioro de la disponibilidad o accesibilidad del sitio web</li>
                <li>No utilizar el sitio web para transmitir o enviar material comercial no solicitado o no autorizado</li>
                <li>No utilizar el sitio web para transmitir o enviar material que sea difamatorio, ofensivo, abusivo, indecente, amenazante, vulgar, obsceno, profano o de otra manera objetable</li>
                <li>No utilizar el sitio web para transmitir o enviar material que constituya o fomente conductas que serían una ofensa penal, den lugar a responsabilidad civil o de otra manera violen cualquier ley local, estatal, nacional o internacional</li>
                <li>No utilizar el sitio web para transmitir o enviar material que infrinja los derechos de propiedad intelectual de terceros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Propiedad Intelectual</h2>
              <p className="text-gray-700 mb-4">
                El sitio web y su contenido original, características y funcionalidad son propiedad de Duartec Instalaciones Informáticas y están protegidos por las leyes de propiedad intelectual internacionales, españolas y locales.
              </p>
              <p className="text-gray-700 mb-4">
                El contenido del sitio web incluye, pero no se limita a, texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos. Todo el contenido del sitio web es propiedad de Duartec Instalaciones Informáticas o de sus proveedores de contenido y está protegido por las leyes de derechos de autor.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Información del Sitio Web</h2>
              <p className="text-gray-700 mb-4">
                Aunque nos esforzamos por mantener la información en este sitio web actualizada y precisa, no garantizamos que la información sea completa, precisa, actualizada o libre de errores. La información proporcionada en este sitio web se ofrece &quot;tal como está&quot; sin garantías de ningún tipo.
              </p>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar, actualizar o eliminar cualquier información en este sitio web en cualquier momento sin previo aviso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Enlaces a Terceros</h2>
              <p className="text-gray-700 mb-4">
                Nuestro sitio web puede contener enlaces a sitios web de terceros que no están bajo nuestro control. No tenemos responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web de terceros.
              </p>
              <p className="text-gray-700 mb-4">
                La inclusión de enlaces a sitios web de terceros no implica nuestra aprobación o respaldo de dichos sitios web o su contenido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitación de Responsabilidad</h2>
              <p className="text-gray-700 mb-4">
                En ningún caso Duartec Instalaciones Informáticas será responsable por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pero no limitándose a pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, que resulten de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Su uso o incapacidad para usar el sitio web</li>
                <li>Cualquier cambio que realicemos al sitio web o cualquier interrupción temporal o permanente en la provisión del sitio web</li>
                <li>Acceso no autorizado o alteración de sus transmisiones o datos</li>
                <li>Declaraciones o conducta de cualquier tercero en el sitio web</li>
                <li>Cualquier otro asunto relacionado con el sitio web</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Indemnización</h2>
              <p className="text-gray-700 mb-4">
                Usted acepta indemnizar y mantener indemne a Duartec Instalaciones Informáticas y sus directores, funcionarios, empleados y agentes de y contra cualquier reclamo, daño, obligación, pérdida, responsabilidad, costo o deuda y gastos (incluyendo pero no limitándose a honorarios de abogados) que surjan de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Su uso del sitio web</li>
                <li>Su violación de estas condiciones de uso</li>
                <li>Su violación de cualquier derecho de un tercero</li>
                <li>Cualquier reclamo de que su uso del sitio web ha causado daño a un tercero</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Terminación</h2>
              <p className="text-gray-700 mb-4">
                Podemos terminar o suspender su acceso inmediatamente, sin previo aviso o responsabilidad, por cualquier razón, incluyendo sin limitación si usted viola las Condiciones de Uso.
              </p>
              <p className="text-gray-700 mb-4">
                Tras la terminación, su derecho a usar el sitio web cesará inmediatamente. Si desea terminar su cuenta, simplemente puede dejar de usar el sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Ley Aplicable</h2>
              <p className="text-gray-700 mb-4">
                Estas condiciones se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
              </p>
              <p className="text-gray-700 mb-4">
                Cualquier disputa que surja de estas condiciones o del uso del sitio web será resuelta exclusivamente en los tribunales de Burgos, España.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Modificaciones</h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estas condiciones en cualquier momento. Si una revisión es material, intentaremos proporcionar al menos 30 días de aviso previo a cualquier nueva condición que entre en vigor.
              </p>
              <p className="text-gray-700 mb-4">
                Lo que constituye un cambio material será determinado a nuestra sola discreción. Al continuar accediendo o usando nuestro sitio web después de que esas revisiones entren en vigor, usted acepta estar sujeto a las condiciones revisadas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Separabilidad</h2>
              <p className="text-gray-700 mb-4">
                Si alguna disposición de estas condiciones se considera inválida o inaplicable por un tribunal de jurisdicción competente, las disposiciones restantes de estas condiciones permanecerán en vigor. La disposición inválida o inaplicable será reemplazada por una disposición válida y aplicable que más se acerque a la intención de la disposición original.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tiene alguna pregunta sobre estas condiciones de uso, puede contactar con nosotros a través de:
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
