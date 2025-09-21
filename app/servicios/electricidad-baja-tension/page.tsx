import { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Shield, Wrench, FileCheck, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Instalaciones Eléctricas de Baja Tensión - Duartec',
  description: 'Diseño, instalación y certificación de instalaciones eléctricas de baja tensión en Burgos: viviendas, locales y pymes. Cumplimiento REBT y boletines.',
};

export default function BajaTensionPage() {
  const features = [
    'Cuadros eléctricos y protección diferencial',
    'Canalizaciones, cableado y mecanismos',
    'Reformas y adecuaciones a normativa',
    'Certificados, boletines y legalización (REBT)',
    'Iluminación LED y eficiencia energética',
    'Mantenimiento preventivo y correctivo',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-slate-800 dark:to-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/servicios" className="text-accent hover:underline inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a servicios
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">Instalaciones Eléctricas de Baja Tensión</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              Ejecución, mantenimiento y certificación de instalaciones BT para viviendas, comercios y pymes en Burgos. Trabajo seguro, limpio y conforme a normativa vigente.
            </p>
          </div>
        </div>
      </section>

      {/* Detalle */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Qué realizamos</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-600" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <Shield className="w-6 h-6 text-yellow-600 mb-2" />
              <h3 className="font-semibold mb-1">Seguridad</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Protecciones diferenciales y magnetotérmicas adecuadas al uso.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <Wrench className="w-6 h-6 text-yellow-600 mb-2" />
              <h3 className="font-semibold mb-1">Ejecución</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Montaje limpio y ordenado de canalizaciones y mecanismos.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <FileCheck className="w-6 h-6 text-yellow-600 mb-2" />
              <h3 className="font-semibold mb-1">Certificación</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Boletines y legalización según REBT para tu instalación.</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-6 rounded-xl bg-accent text-white">
            <h3 className="text-xl font-semibold mb-2">¿Necesitas un presupuesto?</h3>
            <p className="opacity-90">Cuéntanos tu proyecto y te asesoramos sin compromiso.</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/contacto" className="inline-block bg-white text-accent font-semibold px-4 py-2 rounded-md text-center hover:bg-gray-100">
                Contactar ahora
              </Link>
          <a href="tel:+34947256430" className="inline-block border border-white/70 font-semibold px-4 py-2 rounded-md text-center hover:bg-white hover:text-accent">
            Llamar 947 256 430
          </a>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <h3 className="font-semibold mb-2">Ámbitos</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Viviendas y comunidades</li>
              <li>• Locales comerciales y oficinas</li>
              <li>• Pequeña industria</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
