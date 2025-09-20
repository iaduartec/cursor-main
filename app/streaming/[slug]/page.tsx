import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllStreams, getStreamBySlug } from '../../../lib/db-streams';

const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export async function generateStaticParams() {
  const cams = await getAllStreams();
  return cams.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getStreamBySlug(normalizeSlug(slug));
  if (!s) {
    return {
      title: 'Streaming no encontrado',
      description: 'La cámara que buscas no existe o no está disponible.'
    };
  }
  return {
    title: `Streaming ${s.name} - Cámara en directo`,
    description: s.description || `Emisión 24 horas desde ${s.name} (Burgos)`,
    openGraph: {
      title: `Streaming ${s.name}`,
      description: s.description || undefined,
      images: s.image ? [s.image] : undefined,
    },
  };
}

export default async function StreamingCamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getStreamBySlug(normalizeSlug(slug));
  if (!s) {notFound();}

  const src = s.embedUrl || (s.youtubeId ? `https://www.youtube.com/embed/${s.youtubeId}` : '');

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/streaming" className="text-accent hover:underline">← Volver a Streaming</Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 text-primary dark:text-white">{s.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Cámara en directo 24/7</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto py-8 px-4">
        <div className="relative w-full h-[60vh] min-h-[380px] max-h-[80vh] rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-black">
          {src ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={src}
              title={s.name}
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">Stream no disponible</div>
          )}
        </div>
      </section>
    </div>
  );
}

