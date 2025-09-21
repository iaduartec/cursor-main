import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db/client';
import { streams } from '../../../../../db/schema';
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
    const allStreams = await db
      .select({
        id: streams.id,
        slug: streams.slug,
        name: streams.name,
        description: streams.description,
        provider: streams.provider,
        youtubeId: streams.youtubeId,
        embedUrl: streams.embedUrl,
        image: streams.image,
        isLive: streams.isLive,
        createdAt: streams.createdAt,
        updatedAt: streams.updatedAt,
      })
      .from(streams)
      .orderBy(streams.createdAt);

    return NextResponse.json(allStreams);
  } catch (error) {
    console.error('Error fetching streams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch streams' },
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
      name,
      description,
      provider = 'youtube',
      youtubeId,
      embedUrl,
      image,
      isLive = true,
    } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingStream = await db
      .select()
      .from(streams)
      .where(eq(streams.slug, slug))
      .limit(1);

    if (existingStream.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const newStream = await db
      .insert(streams)
      .values({
        slug,
        name,
        description,
        provider,
        youtubeId,
        embedUrl,
        image,
        isLive,
      })
      .returning();

    revalidateTag('streams');

    return NextResponse.json(newStream[0], { status: 201 });
  } catch (error) {
    console.error('Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}
