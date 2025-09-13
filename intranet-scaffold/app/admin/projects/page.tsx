"use client";
import { useEffect, useState } from "react";

type Project = { id: number; slug: string; title: string; description?: string };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState<{ id: number; title: string } | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (mounted) setProjects(data); })
      .catch(err => { console.error(err); if (mounted) setError(String(err)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // read injected token (only present in non-production dev/test)
    try {
      // @ts-ignore
      const t = typeof window !== 'undefined' ? (window as any).__INTRANET_DEBUG_TOKEN : null;
      if (t) setClientToken(String(t));
    } catch (e) {}
  }, []);

  async function createOrUpdateProject(e: any) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // simple client-side validation to avoid server 422
      if (!slug || !title) {
        setError('Slug and title are required');
        setLoading(false);
        return;
      }
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (clientToken) headers['x-debug-token'] = clientToken;
      if (editing) {
        const res = await fetch(`/api/projects/${editing.id}`, { method: 'PUT', body: JSON.stringify({ slug, title }), headers });
        if (res.ok) {
          const updated = await res.json();
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
          setEditing(null);
          setTitle(''); setSlug('');
        } else {
          // try to parse JSON error body first
          let msg = 'Failed to update';
          try {
            const json = await res.json();
            msg = json?.error || JSON.stringify(json) || msg;
          } catch (_) {
            const txt = await res.text();
            msg = txt || msg;
          }
          throw new Error(msg);
        }
      } else {
        const res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify({ slug, title }) , headers });
        if (res.ok) {
          const p = await res.json();
          setProjects(prev => [p, ...prev]);
          setTitle(''); setSlug('');
        } else {
          let msg = 'Failed to create';
          try {
            const json = await res.json();
            msg = json?.error || JSON.stringify(json) || msg;
          } catch (_) {
            const txt = await res.text();
            msg = txt || msg;
          }
          throw new Error(msg);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p: Project) {
    setEditing(p);
    setTitle(p.title || '');
    setSlug(p.slug || '');
  }

  async function deleteProject(id: number) {
    setError(null);
    setLoading(true);
    try {
      const headers: Record<string,string> = {};
      if (clientToken) headers['x-debug-token'] = clientToken;
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        const txt = await res.text();
        throw new Error(txt || 'Failed to delete');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  // search + pagination derived list
  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const visible = filtered.slice((page-1)*perPage, page*perPage);

  function cancelEdit() {
    setEditing(null);
    setTitle(''); setSlug('');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin — Proyectos</h1>
        <div className="text-sm text-gray-500">E2E-friendly (no blocking confirms)</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-100 rounded">{error}</div>
      )}

      <form onSubmit={createOrUpdateProject} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input className="mt-1 block w-full border rounded px-3 py-2" placeholder="demo-slug" value={slug} onChange={e => setSlug(e.target.value)} disabled={loading} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input className="mt-1 block w-full border rounded px-3 py-2" placeholder="Demo Project" value={title} onChange={e => setTitle(e.target.value)} disabled={loading} />
        </div>

        <div className="md:col-span-3 flex items-center gap-3 mt-2">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={loading}>
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            ) : null}
            {editing ? 'Actualizar proyecto' : 'Crear proyecto'}
          </button>
          {editing && <button type="button" onClick={cancelEdit} className="px-3 py-2 border rounded" disabled={loading}>Cancelar</button>}
        </div>
      </form>

      <section className="bg-white rounded shadow divide-y">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Listado de proyectos</h2>
          <div className="text-sm text-gray-500">{projects.length} items</div>
        </div>

        <div className="p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <input aria-label="Buscar" placeholder="Buscar por título o slug" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full max-w-md" />
            <div className="text-sm text-gray-500">Mostrando {visible.length} de {total}</div>
          </div>

          {loading && projects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Cargando proyectos…</div>
          ) : (
            <ul>
              {visible.map(p => (
                <li key={p.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(p)} className="px-3 py-1 border rounded text-sm" disabled={loading}>Editar</button>
                    <button onClick={() => setShowConfirm({ id: p.id, title: p.title })} className="px-3 py-1 bg-red-600 text-white rounded text-sm" disabled={loading}>Borrar</button>
                  </div>
                </li>
              ))}
              {total === 0 && (
                <li className="p-6 text-center text-gray-500">No hay proyectos — crea uno arriba.</li>
              )}
            </ul>
          )}

          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Página {page} de {pages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded" disabled={page === 1}>Anterior</button>
              <button onClick={() => setPage(p => Math.min(pages, p+1))} className="px-3 py-1 border rounded" disabled={page === pages}>Siguiente</button>
            </div>
          </div>
        </div>
      </section>

      {/* Non-blocking confirm modal */}
      {showConfirm ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Confirmar borrado</h3>
            <p className="mb-4">¿Borrar <strong>{showConfirm.title}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirm(null)} className="px-3 py-2 border rounded">Cancelar</button>
              <button onClick={async () => { const id = showConfirm!.id; setShowConfirm(null); await deleteProject(id); }} className="px-3 py-2 bg-red-600 text-white rounded">Borrar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
