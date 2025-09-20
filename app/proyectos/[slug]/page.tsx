<<<<<<< HEAD
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects, getProjectBySlug } from '../../../lib/db-projects';
import { marked } from 'marked';
=======
/**
Resumen generado automáticamente.

app/proyectos/[slug]/page.tsx

2025-09-13T06:20:07.365Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 2416 caracteres, 65 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects, getProjectBySlug } from '../../../lib/db-projects.new';
import { marked } from 'marked';
import { sanitizeHtml } from '../../../lib/sanitize-html';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

const normalizeSlug = (s: string) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export async function generateStaticParams() {
  const items = await getAllProjects();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(normalizeSlug(slug));
  if (!p) {return { title: 'Proyecto no encontrado' };}
  return {
    title: `${p.title} - Proyecto`,
    description: p.description || undefined,
    openGraph: { title: p.title, description: p.description || undefined, images: p.image ? [p.image] : undefined },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProjectBySlug(normalizeSlug(slug));
  if (!p) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <Link href="/proyectos" className="text-accent">Volver a proyectos</Link>
      </div>
    );
  }
<<<<<<< HEAD
  const html = (await marked.parse(p.content || p.description || '')) as string;
=======
  const htmlRaw = (await marked.parse(p.content || p.description || '')) as string;
  const html = sanitizeHtml(htmlRaw);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/proyectos" className="text-accent hover:underline">← Volver a proyectos</Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 text-primary dark:text-white">{p.title}</h1>
          {p.image && (
            <div className="relative w-full h-72 rounded-xl overflow-hidden mt-6">
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </div>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-12 px-4">
<<<<<<< HEAD
        <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
=======
  {/* Content generated from markdown; sanitized by lib/sanitize-html.ts */}
  {/* eslint-disable-next-line react/no-danger */}
  <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
      </section>
    </div>
  );
}

