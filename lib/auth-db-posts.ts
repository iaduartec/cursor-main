import { createAuthenticatedClient } from '../db/client';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';
import { stackServerApp } from '@stackframe/stack/server';

export async function createPost(data: {
  title: string;
  content: string;
  slug: string;
  description?: string;
  category?: string;
  image?: string;
  published?: boolean;
  date?: Date;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const token = await stackServerApp.getAccessToken();
  if (!token) {
    throw new Error('Token JWT no disponible');
  }

  const db = createAuthenticatedClient(token);

  return await db
    .insert(posts)
    .values({
      ...data,
      userId: user.id,
      date: data.date || new Date(),
    })
    .returning();
}

export async function updatePost(
  id: number,
  data: Partial<{
    title: string;
    content: string;
    slug: string;
    description?: string;
    category?: string;
    image?: string;
    published?: boolean;
  }>
) {
  const user = await stackServerApp.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const token = await stackServerApp.getAccessToken();
  if (!token) {
    throw new Error('Token JWT no disponible');
  }

  const db = createAuthenticatedClient(token);

  return await db.update(posts).set(data).where(eq(posts.id, id)).returning();
}

export async function deletePost(id: number) {
  const user = await stackServerApp.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const token = await stackServerApp.getAccessToken();
  if (!token) {
    throw new Error('Token JWT no disponible');
  }

  const db = createAuthenticatedClient(token);

  return await db.delete(posts).where(eq(posts.id, id)).returning();
}
