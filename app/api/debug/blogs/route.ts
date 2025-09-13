/**
Resumen generado automáticamente.

app/api/debug/blogs/route.ts

2025-09-13T06:20:07.361Z

——————————————————————————————
Archivo .ts: route.ts
Tamaño: 832 caracteres, 21 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
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
