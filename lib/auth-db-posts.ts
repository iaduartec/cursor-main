import { createAuthenticatedClient } from '../db/client';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function createPost(data: {
  title: string;
  content: string;
  slug: string;
  description?: string;
  category?: string;
  image?: string;
  published?: boolean;
}) {
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const token = await getToken();
  if (!token) {
    throw new Error('Token JWT no disponible');
  }

  const db = createAuthenticatedClient(token);

  return await db
    .insert(posts)
    .values({
      ...data,
      userId,
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
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const token = await getToken();
  if (!token) {
    throw new Error('Token JWT no disponible');
  }

  const db = createAuthenticatedClient(token);

  return await db.update(posts).set(data).where(eq(posts.id, id)).returning();
}

export async function deletePost(id: number) {
  const { userId, getToken } = await auth();

  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const token = await getToken();
  if (!token) {
    throw new Error('Token JWT no disponible');
  }

  const db = createAuthenticatedClient(token);

  return await db.delete(posts).where(eq(posts.id, id)).returning();
}
