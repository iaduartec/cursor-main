import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../db/client';
import { projects } from '../../db/schema';

function checkAdminAccess(req: NextApiRequest) {
  const token = process.env.INTRANET_DEBUG_TOKEN;
  if (token) {
    const provided = req.headers['x-debug-token'] || '';
    return provided === token;
  }
  // if no token configured, allow in non-production
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const allProjects = await db
        .select({
          id: projects.id,
          slug: projects.slug,
          title: projects.title,
          description: projects.description,
          hero_image: projects.image,
          created_at: projects.createdAt,
        })
        .from(projects)
        .orderBy(projects.createdAt);

      return res.status(200).json(allProjects);
    } catch (err: any) {
      console.error('API /api/projects GET error:', err);
      // If DB is not configured (common in local dev), return empty list instead of 500
      if (err && /Database URL not configured/i.test(err.message)) {
        return res.status(200).json([]);
      }
      // Unknown error -> bubble up as 500
      return res
        .status(500)
        .json({ error: err?.message ?? 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    if (!checkAdminAccess(req)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const { slug, title, description, hero_image } = req.body;

      if (!slug || !title) {
        return res
          .status(400)
          .json({ error: 'Missing required fields: slug, title' });
      }

      const newProject = await db
        .insert(projects)
        .values({
          slug,
          title,
          description: description || '',
          image: hero_image || '',
          content: '',
          category: '',
          date: new Date(),
        })
        .returning({
          id: projects.id,
          slug: projects.slug,
          title: projects.title,
          description: projects.description,
          hero_image: projects.image,
          created_at: projects.createdAt,
        });

      return res.status(201).json(newProject[0]);
    } catch (err: any) {
      console.error('API /api/projects POST error:', err);
      return res
        .status(500)
        .json({ error: err?.message ?? 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
