import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/client';
import { posts } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const expected = process.env.ADMIN_TOKEN || '';
  return expected !== '' && token === expected;
}

export async function GET() {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        content: posts.content,
        category: posts.category,
        image: posts.image,
        date: posts.date,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(posts.date);

    return NextResponse.json({ posts: allPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      slug,
      title,
      description,
      content,
      category,
      image,
      date,
      published = true,
    } = body || {};

    if (!slug || !title || !content) {
      return NextResponse.json(
        {
          error: 'Missing required fields: slug, title, content',
        },
        { status: 400 }
      );
    }

    const postDate = date ? new Date(date) : new Date();
    const now = new Date();

    const [newPost] = await db
      .insert(posts)
      .values({
        slug,
        title,
        description: description ?? null,
        content,
        category: category ?? null,
        image: image ?? null,
        date: postDate,
        published: Boolean(published),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Revalidate caches
    revalidateTag('blogs');
    revalidateTag('posts');

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      id,
      slug,
      title,
      description,
      content,
      category,
      image,
      date,
      published,
    } = body || {};

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
    if (category !== undefined) {
      updateData.category = category;
    }
    if (image !== undefined) {
      updateData.image = image;
    }
    if (date !== undefined) {
      updateData.date = new Date(date);
    }
    if (published !== undefined) {
      updateData.published = Boolean(published);
    }
    if (slug !== undefined) {
      updateData.slug = slug;
    }

    let result;
    if (id) {
      result = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();
    } else {
      result = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.slug, slug))
        .returning();
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Revalidate caches
    revalidateTag('blogs');
    revalidateTag('posts');

    return NextResponse.json({ post: result[0] });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
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
        .delete(posts)
        .where(eq(posts.id, parseInt(id, 10)))
        .returning();
    } else if (slug) {
      result = await db.delete(posts).where(eq(posts.slug, slug)).returning();
    } else {
      return NextResponse.json(
        {
          error: 'Invalid identifier provided',
        },
        { status: 400 }
      );
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Revalidate caches
    revalidateTag('blogs');
    revalidateTag('posts');

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
