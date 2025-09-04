import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Streaming Rabanera del Pinar - Cámara en directo',
  description: 'Emisión 24 horas desde Rabanera del Pinar (Burgos)'
};

export default function RabaneraCamPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/streaming" className="text-accent hover:underline">← Volver a Streaming</Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 text-primary dark:text-white">Rabanera del Pinar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Cámara en directo 24/7</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto py-8 px-4">
        <div className="relative w-full h-[60vh] min-h-[380px] max-h-[80vh] rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/2FLLNsHmgxc"
            title="Rabanera del Pinar"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}

