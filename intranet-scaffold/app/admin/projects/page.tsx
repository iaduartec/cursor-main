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

  useEffect(() => {
    let mounted = true;
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (mounted) setProjects(data); })
      .catch(err => { console.error(err); if (mounted) setError(String(err)); });
    return () => { mounted = false; };
  }, []);

  async function createOrUpdateProject(e: any) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editing) {
        // update
        const res = await fetch(`/api/projects/${editing.id}`, { method: 'PUT', body: JSON.stringify({ slug, title }), headers: { 'Content-Type': 'application/json' }});
        if (res.ok) {
          const updated = await res.json();
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
          setEditing(null);
          setTitle(''); setSlug('');
        } else {
          const txt = await res.text();
          throw new Error(txt || 'Failed to update');
        }
      } else {
        // create
        const res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify({ slug, title }) , headers: { 'Content-Type': 'application/json' }});
        if (res.ok) {
          const p = await res.json();
          setProjects(prev => [p, ...prev]);
          setTitle(''); setSlug('');
        } else {
          const txt = await res.text();
          throw new Error(txt || 'Failed to create');
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
    // No blocking confirm() here so E2E or automated scripts won't be interrupted.
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
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

  function cancelEdit() {
    setEditing(null);
    setTitle(''); setSlug('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin - Projects</h1>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <form onSubmit={createOrUpdateProject} style={{ marginBottom: 16 }}>
        <input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} disabled={loading} />
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} disabled={loading} />
        <button type="submit" disabled={loading}>{loading ? 'Working...' : (editing ? 'Update' : 'Create')}</button>
        {editing && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }} disabled={loading}>Cancel</button>}
      </form>

      <ul>
        {projects.map(p => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <strong>{p.title}</strong> — {p.slug} {' '}
            <button onClick={() => startEdit(p)} style={{ marginLeft: 8 }} disabled={loading}>Edit</button>
            <button onClick={() => deleteProject(p.id)} style={{ marginLeft: 8, color: 'red' }} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
