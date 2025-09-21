import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllServices, getServiceBySlug } from '../../../lib/db-services';

const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export async function generateStaticParams() {
  const items = await getAllServices();
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(normalizeSlug(slug));
  if (!s) return { title: 'Servicio no encontrado' };
  return {
    title: `${s.title} - Servicios` ,
    description: s.description || undefined,
    openGraph: {
      title: s.title,
      description: s.description || undefined,
      images: s.image ? [s.image] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getServiceBySlug(normalizeSlug(slug));
  if (!s) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Servicio no encontrado</h1>
        <Link href="/servicios" className="text-accent">Volver a servicios</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20 px-4 overflow-hidden">
        {s.image && (
          <Image src={s.image} alt={s.title} fill className="object-cover opacity-10" />
        )}
        <div className="relative max-w-5xl mx-auto">
          <nav className="mb-6">
            <Link href="/servicios" className="text-accent hover:underline">← Volver a servicios</Link>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary dark:text-white">{s.title}</h1>
          {s.areaServed && (
            <p className="text-gray-600 dark:text-gray-300">Área: {s.areaServed}</p>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-12 px-4">
        <div className="prose dark:prose-invert max-w-none">
          <p>{s.description}</p>
        </div>
      </section>
    </div>
  );
}

