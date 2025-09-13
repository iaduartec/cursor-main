"use client";
import { useEffect, useState } from "react";

type Project = { id: number; slug: string; title: string; description?: string };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  async function createOrUpdateProject(e: any) {
    e.preventDefault();
    if (editing) {
      // update
      const res = await fetch(`/api/projects/${editing.id}`, { method: 'PUT', body: JSON.stringify({ slug, title }), headers: { 'Content-Type': 'application/json' }});
      if (res.ok) {
        const updated = await res.json();
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditing(null);
        setTitle(''); setSlug('');
      } else {
        console.error('Failed to update');
      }
    } else {
      // create
      const res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify({ slug, title }) , headers: { 'Content-Type': 'application/json' }});
      if (res.ok) {
        const p = await res.json();
        setProjects(prev => [p, ...prev]);
        setTitle(''); setSlug('');
      } else {
        console.error('Failed to create');
      }
    }
  }

  function startEdit(p: Project) {
    setEditing(p);
    setTitle(p.title || '');
    setSlug(p.slug || '');
  }

  async function deleteProject(id: number) {
    if (!confirm('¿Eliminar proyecto?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id));
    } else {
      console.error('Failed to delete');
    }
  }

  function cancelEdit() {
    setEditing(null);
    setTitle(''); setSlug('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin - Projects</h1>
      <form onSubmit={createOrUpdateProject} style={{ marginBottom: 16 }}>
        <input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
        {editing && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>}
      </form>

      <ul>
        {projects.map(p => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <strong>{p.title}</strong> — {p.slug} {' '}
            <button onClick={() => startEdit(p)} style={{ marginLeft: 8 }}>Edit</button>
            <button onClick={() => deleteProject(p.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
