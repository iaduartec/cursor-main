/**
Resumen generado automáticamente.

app/admin/streams/page.tsx

2025-09-13T06:20:07.360Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 4003 caracteres, 100 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '../../../db/client';
import { streams } from '../../../db/schema';
import { getAllStreams } from '../../../lib/db-streams';
import { eq } from 'drizzle-orm';

export default async function AdminStreamsPage() {
  const items = await getAllStreams();

  async function upsert(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const provider = String(formData.get('provider') || 'youtube');
    const youtubeId = String(formData.get('youtubeId') || '');
    const embedUrl = String(formData.get('embedUrl') || '');
    const image = String(formData.get('image') || '');
    const description = String(formData.get('description') || '');
    const isLive = formData.get('isLive') ? true : false;
    const now = new Date();
    await db
      .insert(streams)
      .values({
        slug,
        name,
        provider,
        youtubeId: youtubeId || null,
        embedUrl: embedUrl || null,
        image: image || null,
        description: description || null,
        isLive,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: streams.slug,
        set: { name, provider, youtubeId: youtubeId || null, embedUrl: embedUrl || null, image: image || null, description: description || null, isLive, updatedAt: now },
      });
    revalidateTag('streams');
    revalidatePath('/streaming');
    revalidatePath('/admin/streams');
  }

  async function remove(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '');
    await db.delete(streams).where(eq(streams.slug, slug));
    revalidateTag('streams');
    revalidatePath('/streaming');
    revalidatePath('/admin/streams');
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cámaras</h1>

      <form action={upsert} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded mb-8">
        <input name="slug" placeholder="slug" className="border rounded px-2 py-2" required />
        <input name="name" placeholder="nombre" className="border rounded px-2 py-2" required />
        <input name="provider" placeholder="provider (youtube)" defaultValue="youtube" className="border rounded px-2 py-2" />
        <input name="youtubeId" placeholder="youtubeId" className="border rounded px-2 py-2" />
        <input name="embedUrl" placeholder="embedUrl (opcional)" className="border rounded px-2 py-2" />
        <input name="image" placeholder="image URL (opcional)" className="border rounded px-2 py-2" />
        <label className="flex items-center gap-2"><input type="checkbox" name="isLive" defaultChecked /> En vivo</label>
        <textarea name="description" placeholder="descripción" className="border rounded px-2 py-2 md:col-span-2" />
        <div className="md:col-span-2"><button className="bg-accent text-white px-4 py-2 rounded">Crear/Actualizar</button></div>
      </form>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Slug</th>
            <th>Nombre</th>
            <th>Provider</th>
            <th>YouTube ID</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.slug} className="border-b">
              <td className="py-2">{s.slug}</td>
              <td>{s.name}</td>
              <td>{s.provider}</td>
              <td>{s.youtubeId}</td>
              <td>
                <form action={remove}>
                  <input type="hidden" name="slug" value={s.slug} />
                  <button className="text-red-600">Eliminar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export const dynamic = 'force-dynamic';
