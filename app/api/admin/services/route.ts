import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/client';
import { services } from '../../../../db/schema';
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
    const allServices = await db
      .select({
        id: services.id,
        slug: services.slug,
        title: services.title,
        description: services.description,
        image: services.image,
        areaServed: services.areaServed,
        hasOfferCatalog: services.hasOfferCatalog,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
      })
      .from(services)
      .orderBy(services.createdAt);

    return NextResponse.json({ services: allServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
    const {
      slug,
      title,
      description,
      image,
      areaServed,
      hasOfferCatalog = false,
    } = body || {};

    if (!slug || !title) {
      return NextResponse.json(
        {
          error: 'Missing required fields: slug, title',
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const [newService] = await db
      .insert(services)
      .values({
        slug,
        title,
        description: description ?? null,
        image: image ?? null,
        areaServed: areaServed ?? null,
        hasOfferCatalog: Boolean(hasOfferCatalog),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Revalidate caches
    revalidateTag('services');

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
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
    const { id, slug, title, description, image, areaServed, hasOfferCatalog } =
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
    if (image !== undefined) {
      updateData.image = image;
    }
    if (areaServed !== undefined) {
      updateData.areaServed = areaServed;
    }
    if (hasOfferCatalog !== undefined) {
      updateData.hasOfferCatalog = Boolean(hasOfferCatalog);
    }
    if (slug !== undefined) {
      updateData.slug = slug;
    }

    let result;
    if (id) {
      result = await db
        .update(services)
        .set(updateData)
        .where(eq(services.id, id))
        .returning();
    } else {
      result = await db
        .update(services)
        .set(updateData)
        .where(eq(services.slug, slug))
        .returning();
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Revalidate caches
    revalidateTag('services');

    return NextResponse.json({ service: result[0] });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
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
        .delete(services)
        .where(eq(services.id, parseInt(id, 10)))
        .returning();
    } else if (slug) {
      result = await db
        .delete(services)
        .where(eq(services.slug, slug))
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
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Revalidate caches
    revalidateTag('services');

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
