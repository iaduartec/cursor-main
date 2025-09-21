import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aviso Legal | Duartec Instalaciones Informáticas',
  description: 'Aviso legal y condiciones de uso del sitio web de Duartec Instalaciones Informáticas.',
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-accent hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Aviso Legal</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Aviso Legal</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Información General</h2>
              <p className="text-gray-700 mb-4">
                En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y el Comercio Electrónico (LSSI-CE), se facilitan a continuación los siguientes datos de información general de este sitio web:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Denominación social:</strong> Duartec Instalaciones Informáticas</li>
                <li><strong>NIF/CIF:</strong> B00000000</li>
                <li><strong>Domicilio:</strong> Burgos, España</li>
                <li><strong>Email:</strong> info@duartec.es</li>
                <li><strong>Teléfono:</strong> 947 256 430</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Términos y Condiciones de Uso</h2>
              <p className="text-gray-700 mb-4">
                El acceso y uso de este sitio web implica la aceptación expresa y sin reservas de todos los términos y condiciones incluidos en este Aviso Legal.
              </p>
              <p className="text-gray-700 mb-4">
                Los contenidos de este sitio web tienen una finalidad puramente informativa y no constituyen en ningún caso una oferta comercial, solicitud de compra o recomendación para realizar inversiones de ningún tipo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Propiedad Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Los derechos de propiedad intelectual del contenido de las páginas web, su diseño gráfico y códigos son titularidad de Duartec Instalaciones Informáticas y quedan reservados todos los derechos sobre los mismos.
              </p>
              <p className="text-gray-700 mb-4">
                Queda prohibida la reproducción total o parcial de los contenidos de este sitio web sin citar su procedencia o solicitar autorización previa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Responsabilidad</h2>
              <p className="text-gray-700 mb-4">
                Duartec Instalaciones Informáticas no se hace responsable de los daños y perjuicios que se pudieran derivar de interferencias, omisiones, interrupciones, virus informáticos, averías telefónicas o desconexiones en el funcionamiento operativo de este sistema electrónico.
              </p>
              <p className="text-gray-700 mb-4">
                Asimismo, no se garantiza la ausencia de errores ni que se corrijan los defectos, ni la ausencia de virus y otros componentes dañinos en el sitio web o en el servidor que lo suministra.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Enlaces</h2>
              <p className="text-gray-700 mb-4">
                Los enlaces que aparecen en este sitio web son únicamente a título informativo. Duartec Instalaciones Informáticas no se hace responsable de los contenidos, informaciones o servicios que aparezcan en dichos sitios, que tendrán únicamente carácter informativo y en ningún caso implican relación alguna entre Duartec Instalaciones Informáticas y las personas o entidades titulares de tales contenidos o titulares de los sitios donde se encuentren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Modificaciones</h2>
              <p className="text-gray-700 mb-4">
                Duartec Instalaciones Informáticas se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se prestan como la forma en la que éstos aparecen presentados o localizados en su sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Legislación Aplicable</h2>
              <p className="text-gray-700 mb-4">
                Las presentes condiciones se rigen por la legislación española. Para cualquier litigio que pudiera surgir relacionado con el sitio web o la actividad que en él se desarrolla serán competentes los Juzgados y Tribunales de Burgos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para cualquier consulta relacionada con este aviso legal, puede contactar con nosotros a través de:
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
