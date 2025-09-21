import { revalidatePath, revalidateTag } from 'next/cache';
import { db, type DrizzleClient } from '../../../db/client';
import { services, type NewService, type Service } from '../../../db/schema';
import { eq, asc } from 'drizzle-orm';

async function getItems() {
  const typedDb = db as unknown as DrizzleClient;
  return await typedDb.select().from(services).orderBy(asc(services.title));
}
}

export default async function AdminServicesPage() {
  const items = await getItems();

  async function upsert(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '');
    const image = String(formData.get('image') || '');
    const areaServed = String(formData.get('areaServed') || '');
    const hasOfferCatalog = formData.get('hasOfferCatalog') ? true : false;
    const now = new Date();
    const typedDb = db as unknown as DrizzleClient;
    await typedDb
      .insert(services)
      .values({ slug, title, description: description || null, image: image || null, areaServed: areaServed || null, hasOfferCatalog, createdAt: now, updatedAt: now } as NewService)
      .onConflictDoUpdate({ target: services.slug, set: { title, description: description || null, image: image || null, areaServed: areaServed || null, hasOfferCatalog, updatedAt: now } as Partial<NewService> });
    revalidateTag('services');
    revalidatePath('/admin/services');
  }

  async function remove(formData: FormData) {
    'use server';
    const slug = String(formData.get('slug') || '');
    const typedDb = db as unknown as DrizzleClient;
    await typedDb.delete(services).where(eq(services.slug, slug));
    revalidateTag('services');
    revalidatePath('/admin/services');
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Servicios</h1>
      <form action={upsert} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded mb-8">
        <input name="slug" placeholder="slug" className="border rounded px-2 py-2" required />
        <input name="title" placeholder="título" className="border rounded px-2 py-2" required />
        <input name="image" placeholder="image URL" className="border rounded px-2 py-2" />
        <input name="areaServed" placeholder="área servida" className="border rounded px-2 py-2" />
        <label className="flex items-center gap-2"><input type="checkbox" name="hasOfferCatalog" /> Catálogo de ofertas</label>
        <textarea name="description" placeholder="descripción" className="border rounded px-2 py-2 md:col-span-2" />
        <div className="md:col-span-2"><button className="bg-accent text-white px-4 py-2 rounded">Crear/Actualizar</button></div>
      </form>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Slug</th>
            <th>Título</th>
            <th>Área</th>
            <th>Catálogo</th>
            <th />
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
          {items.map((s) => (
=======
          {items.map((s: Service) => (
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
            <tr key={s.slug} className="border-b">
              <td className="py-2">{s.slug}</td>
              <td>{s.title}</td>
              <td>{s.areaServed}</td>
              <td>{s.hasOfferCatalog ? 'Sí' : 'No'}</td>
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
