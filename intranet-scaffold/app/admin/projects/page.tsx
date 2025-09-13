"use client";
import { useEffect, useState } from "react";

type Project = { id: number; slug: string; title: string; description?: string };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  async function createProject(e: any) {
    e.preventDefault();
    const res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify({ slug, title }) , headers: { 'Content-Type': 'application/json' }});
    if (res.ok) {
      const p = await res.json();
      setProjects(prev => [p, ...prev]);
      setTitle(''); setSlug('');
    } else {
      console.error('Failed to create');
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin - Projects</h1>
      <form onSubmit={createProject} style={{ marginBottom: 16 }}>
        <input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <button type="submit">Create</button>
      </form>

      <ul>
        {projects.map(p => (
          <li key={p.id}><strong>{p.title}</strong> — {p.slug}</li>
        ))}
      </ul>
    </div>
  );
}
