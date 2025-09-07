import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '../../../db/client';
import { projects } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

async function getItems() {
  return await db.select().from(projects).orderBy(desc(projects.date));
}

export default async function AdminProjectsPage() {
  const items = await getItems();

  async function upsert(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '');
    const content = String(formData.get('content') || '');
    const image = String(formData.get('image') || '');
    const category = String(formData.get('category') || '');
    const dateStr = String(formData.get('date') || '');
    const date = dateStr ? new Date(dateStr) : null;
    const now = new Date();
    await db
      .insert(projects)
      .values({ slug, title, description: description || null, content: content || null, image: image || null, category: category || null, date: date as any, createdAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: projects.slug, set: { title, description: description || null, content: content || null, image: image || null, category: category || null, date: date as any, updatedAt: now } });
    revalidateTag('projects');
    revalidatePath('/admin/projects');
  }

  async function remove(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '');
    await db.delete(projects).where(eq(projects.slug, slug));
    revalidateTag('projects');
    revalidatePath('/admin/projects');
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Proyectos</h1>
      <form action={upsert} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded mb-8">
        <input name="slug" placeholder="slug" className="border rounded px-2 py-2" required />
        <input name="title" placeholder="título" className="border rounded px-2 py-2" required />
        <input name="date" type="datetime-local" className="border rounded px-2 py-2" />
        <input name="category" placeholder="categoría" className="border rounded px-2 py-2" />
        <input name="image" placeholder="image URL" className="border rounded px-2 py-2" />
        <input name="description" placeholder="descripción" className="border rounded px-2 py-2 md:col-span-2" />
        <textarea name="content" placeholder="contenido" className="border rounded px-2 py-2 md:col-span-2 h-40" />
        <div className="md:col-span-2"><button className="bg-accent text-white px-4 py-2 rounded">Crear/Actualizar</button></div>
      </form>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Slug</th>
            <th>Título</th>
            <th>Fecha</th>
            <th>Categoría</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.slug} className="border-b">
              <td className="py-2">{p.slug}</td>
              <td>{p.title}</td>
              <td>{p.date ? new Date(p.date as any).toLocaleString('es-ES') : ''}</td>
              <td>{p.category}</td>
              <td>
                <form action={remove}>
                  <input type="hidden" name="slug" value={p.slug} />
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
