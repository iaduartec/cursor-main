import { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage for testing (shared with projects.ts)
declare global {
  var inMemoryProjects: any[] | undefined;
}

if (!global.inMemoryProjects) {
  global.inMemoryProjects = [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle in-memory database mode for testing
  if (process.env.USE_IN_MEMORY_DB === '1') {
    if (req.method === 'DELETE') {
      const id = parseInt(req.query.id as string);
      if (!id) {
        return res.status(400).json({ error: 'Missing project ID' });
      }

      const index = global.inMemoryProjects!.findIndex((p: any) => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }

      global.inMemoryProjects!.splice(index, 1);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For real database, this would need proper implementation
  return res.status(501).json({ error: 'Not implemented' });
}
