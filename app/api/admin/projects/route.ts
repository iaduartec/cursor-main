import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/client';
import { projects } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// Cookie-based auth function (same as posts)
async function checkAdminAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return false;
    }

    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (Date.now() > tokenData.expires) {
      return false;
    }

    return tokenData.isAdmin && tokenData.userId === 'admin';
  } catch {
    return false;
  }
}

// Legacy Bearer token auth (keeping for backward compatibility)
function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const expected = process.env.ADMIN_TOKEN || '';
  return expected !== '' && token === expected;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication (cookie first, then Bearer token)
    const isAuthenticated = await checkAdminAuth(request) || isAuthorized(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const allProjects = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        title: projects.title,
        description: projects.description,
        content: projects.content,
        image: projects.image,
        category: projects.category,
        date: projects.date,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .orderBy(projects.createdAt);

    return NextResponse.json({ projects: allProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Check authentication (cookie first, then Bearer token)
  const isAuthenticated = await checkAdminAuth(req) || isAuthorized(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { slug, title, description, content, image, category, date } =
      body || {};

    if (!slug || !title) {
      return NextResponse.json(
        {
          error: 'Missing required fields: slug, title',
        },
        { status: 400 }
      );
    }

    const projectDate = date ? new Date(date) : new Date();
    const now = new Date();

    const [newProject] = await db
      .insert(projects)
      .values({
        slug,
        title,
        description: description ?? null,
        content: content ?? null,
        image: image ?? null,
        category: category ?? null,
        date: projectDate,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Revalidate caches
    revalidateTag('projects');

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  // Check authentication (cookie first, then Bearer token)
  const isAuthenticated = await checkAdminAuth(req) || isAuthorized(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { id, slug, title, description, content, image, category, date } =
      body || {};

    if (!id && !slug) {
      return NextResponse.json(
        {
          error: 'Missing identifier: id or slug required',
        },
        { status: 400 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (content !== undefined) {
      updateData.content = content;
    }
    if (image !== undefined) {
      updateData.image = image;
    }
    if (category !== undefined) {
      updateData.category = category;
    }
    if (date !== undefined) {
      updateData.date = new Date(date);
    }
    if (slug !== undefined) {
      updateData.slug = slug;
    }

    let result;
    if (id) {
      result = await db
        .update(projects)
        .set(updateData)
        .where(eq(projects.id, id))
        .returning();
    } else {
      result = await db
        .update(projects)
        .set(updateData)
        .where(eq(projects.slug, slug))
        .returning();
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Revalidate caches
    revalidateTag('projects');

    return NextResponse.json({ project: result[0] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Check authentication (cookie first, then Bearer token)
  const isAuthenticated = await checkAdminAuth(req) || isAuthorized(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json(
        {
          error: 'Missing identifier: id or slug required',
        },
        { status: 400 }
      );
    }

    let result;
    if (id) {
      result = await db
        .delete(projects)
        .where(eq(projects.id, parseInt(id, 10)))
        .returning();
    } else if (slug) {
      result = await db
        .delete(projects)
        .where(eq(projects.slug, slug))
        .returning();
    } else {
      return NextResponse.json(
        {
          error: 'Invalid identifier provided',
        },
        { status: 400 }
      );
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Revalidate caches
    revalidateTag('projects');

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
