import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Duartec Instalaciones Informáticas',
  description: 'Política de privacidad y protección de datos personales de Duartec Instalaciones Informáticas.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-accent hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Política de Privacidad</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Responsable del Tratamiento</h2>
              <p className="text-gray-700 mb-4">
                Duartec Instalaciones Informáticas es el responsable del tratamiento de los datos personales que se recaban a través de este sitio web.
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Finalidad del Tratamiento</h2>
              <p className="text-gray-700 mb-4">
                Sus datos personales serán tratados para las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Gestionar las consultas y solicitudes de información que nos envíe</li>
                <li>Facilitar información sobre nuestros servicios y productos</li>
                <li>Enviar comunicaciones comerciales sobre nuestros servicios</li>
                <li>Gestionar la relación contractual en caso de contratación de servicios</li>
                <li>Cumplir con las obligaciones legales aplicables</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Base Legal</h2>
              <p className="text-gray-700 mb-4">
                El tratamiento de sus datos se basa en:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales</li>
                <li><strong>Interés legítimo:</strong> Para responder a consultas y gestionar la relación comercial</li>
                <li><strong>Cumplimiento de obligaciones legales:</strong> Para cumplir con la normativa aplicable</li>
                <li><strong>Ejecución de contrato:</strong> Para la prestación de servicios contratados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Conservación de Datos</h2>
              <p className="text-gray-700 mb-4">
                Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad y del tratamiento de los datos.
              </p>
              <p className="text-gray-700 mb-4">
                En concreto:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Datos de contacto: Hasta que revoque su consentimiento o solicite la supresión</li>
                <li>Datos contractuales: Durante la vigencia del contrato y los años legalmente establecidos</li>
                <li>Datos de facturación: Durante los años legalmente establecidos para fines fiscales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Destinatarios</h2>
              <p className="text-gray-700 mb-4">
                Sus datos personales no serán cedidos a terceros, salvo que exista una obligación legal o cuando sea necesario para la prestación de los servicios contratados.
              </p>
              <p className="text-gray-700 mb-4">
                En su caso, podrán tener acceso a sus datos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Proveedores de servicios tecnológicos que nos prestan soporte</li>
                <li>Autoridades competentes cuando sea requerido legalmente</li>
                <li>Proveedores de servicios cuando sea necesario para la prestación de servicios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Derechos</h2>
              <p className="text-gray-700 mb-4">
                Puede ejercer los siguientes derechos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Acceso:</strong> Conocer qué datos suyos tenemos y cómo los tratamos</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Eliminar sus datos cuando sea legalmente posible</li>
                <li><strong>Limitación:</strong> Restringir el tratamiento de sus datos</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                <li><strong>Revocación:</strong> Retirar el consentimiento otorgado</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Para ejercer estos derechos, puede contactar con nosotros a través de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Email:</strong> info@duartec.es</li>
                <li><strong>Dirección postal:</strong> Burgos, España</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Este sitio web utiliza cookies para mejorar la experiencia del usuario. Puede consultar nuestra Política de Cookies para obtener información detallada sobre el uso de cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Seguridad</h2>
              <p className="text-gray-700 mb-4">
                Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales que tratamos, evitando su alteración, pérdida, tratamiento o acceso no autorizado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Autoridad de Control</h2>
              <p className="text-gray-700 mb-4">
                Si considera que el tratamiento de sus datos personales no se ajusta a la normativa vigente, puede presentar una reclamación ante la autoridad de control competente (www.aepd.es).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Modificaciones</h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar esta política de privacidad para adaptarla a novedades legislativas o jurisprudenciales. En dichos supuestos, anunciaremos en esta página los cambios introducidos con razonable antelación a su puesta en práctica.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para cualquier consulta relacionada con esta política de privacidad, puede contactar con nosotros a través de:
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
