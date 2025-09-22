import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { projects } from '../../../db/schema';
import { eq } from 'drizzle-orm';

function checkAdminAccess(req: NextRequest) {
  const token = process.env.INTRANET_DEBUG_TOKEN;
  if (token) {
    const provided = req.headers.get('x-debug-token') || '';
    return provided === token;
  }
  // if no token configured, allow in non-production
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return true;
}

export async function GET() {
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

    return NextResponse.json(allProjects);
  } catch (err: any) {
    console.error('API /api/projects GET error:', err);
    // If DB is not configured (common in local dev), return empty list instead of 500
    if (err && /Database URL not configured/i.test(err.message)) {
      return NextResponse.json([]);
    }
    // Unknown error -> bubble up as 500
    return NextResponse.json(
      { error: err?.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminAccess(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { slug, title, description, hero_image } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title' },
        { status: 400 }
      );
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
        date: new Date().toISOString(),
      })
      .returning({
        id: projects.id,
        slug: projects.slug,
        title: projects.title,
        description: projects.description,
        hero_image: projects.image,
        created_at: projects.createdAt,
      });

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (err: any) {
    console.error('API /api/projects POST error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}
