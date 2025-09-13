import { NextResponse } from 'next/server';
import { getPostsPage, getAllPosts } from '../../../../lib/db-posts';

export async function GET(request: Request) {
  try {
    // params quick preview
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '9');
    const category = url.searchParams.get('category') || undefined;
    const q = url.searchParams.get('q') || undefined;

    const pageResult = await getPostsPage({ page, pageSize, category, q });
    const all = await getAllPosts();

    return NextResponse.json({ ok: true, pageResult, allCount: all.length, sampleAll: all.slice(0, 10) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
