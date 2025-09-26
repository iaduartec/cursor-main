import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';

// Mock data for development - replace with actual contentlayer import when available
const mockPosts = [
  {
    _id: 'post-1',
    title: 'Automatización Industrial: El Futuro de la Eficiencia',
    slug: 'automatizacion-industrial-futuro-eficiencia',
    date: '2024-12-30',
    excerpt: 'Descubre cómo la automatización industrial está transformando los procesos productivos',
    category: 'Tecnología',
    published: true,
    author: 'Duartec Team',
    readTime: '8 min',
    tags: ['automatización', 'industria', 'tecnología']
  },
  {
    _id: 'post-2',
    title: 'Domótica: Smart Home para el Siglo XXI',
    slug: 'domotica-smart-home-siglo-xxi',
    date: '2024-12-29',
    excerpt: 'Todo lo que necesitas saber sobre sistemas de domótica inteligente',
    category: 'Domótica',
    published: true,
    author: 'Duartec Team',
    readTime: '6 min',
    tags: ['domótica', 'smart-home', 'iot']
  }
];

// Simple auth middleware function
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

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      // Debug: Log environment status
      console.log('[DEBUG] DATABASE_URL exists:', !!process.env.DATABASE_URL);
      console.log('[DEBUG] Environment:', process.env.NODE_ENV);
      
      // Intentar obtener posts de la base de datos
      const sql = neon(process.env.DATABASE_URL!);
      
      const dbPosts = await sql`
        SELECT id, title, content, slug, excerpt, published, author, category, 
               tags, read_time, created_at, updated_at
        FROM posts 
        ORDER BY created_at DESC
      `;

      console.log('[DEBUG] Found', dbPosts.length, 'posts in database');

      // Convertir al formato esperado por el frontend
      const posts = dbPosts.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        slug: post.slug,
        date: new Date(post.created_at).toISOString().split('T')[0],
        excerpt: post.excerpt || '',
        category: post.category || 'Blog',
        published: post.published ?? true,
        author: post.author || 'Duartec Team',
        readTime: post.read_time || '5 min',
        tags: Array.isArray(post.tags) ? post.tags : []
      }));

      console.log('[DEBUG] Returning', posts.length, 'formatted posts');
      return NextResponse.json({ posts });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback a mock data si la base de datos falla
      const posts = mockPosts.map(post => ({
        id: post._id,
        title: post.title,
        slug: post.slug,
        date: post.date,
        excerpt: post.excerpt || '',
        category: post.category || 'Sin categoría',
        published: post.published ?? true,
        author: post.author || 'Admin',
        readTime: post.readTime || '5 min',
        tags: post.tags || []
      }));

      console.log(`Database failed, using ${posts.length} mock posts`);
      return NextResponse.json({ posts });
    }

  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAdminAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Implementación real: guardar en base de datos
    const { title, content, slug, published = false, tags = [] } = data;
    
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      );
    }

    try {
      // Usar neon database para guardar el post
      const { neon } = require('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL!);
      
      const excerpt = content.substring(0, 160) + (content.length > 160 ? '...' : '');
      const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
      const readTime = `${Math.ceil(content.split(' ').length / 200)} min`;
      
      const result = await sql`
        INSERT INTO posts (title, content, slug, excerpt, published, tags, read_time)
        VALUES (${title}, ${content}, ${slug}, ${excerpt}, ${published}, ${tagsJson}, ${readTime})
        RETURNING id, title, slug, created_at, updated_at
      `;
      
      const savedPost = {
        id: result[0].id.toString(),
        title,
        content,
        slug,
        excerpt,
        published,
        author: 'Duartec Team',
        category: 'Blog',
        tags: Array.isArray(tags) ? tags : [],
        readTime,
        createdAt: result[0].created_at,
        updatedAt: result[0].updated_at
      };
      
      return NextResponse.json({
        success: true,
        message: `Post "${title}" guardado exitosamente en base de datos`,
        data: savedPost
      });
      
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      
      // Fallback: simular guardado si la DB falla
      const savedPost = {
        id: `post-${Date.now()}`,
        title,
        content,
        slug,
        excerpt: content.substring(0, 160) + (content.length > 160 ? '...' : ''),
        published,
        author: 'Duartec Team',
        category: 'Blog',
        tags: Array.isArray(tags) ? tags : [],
        readTime: `${Math.ceil(content.split(' ').length / 200)} min`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        message: `Post "${title}" guardado (modo fallback)`,
        data: savedPost,
        warning: 'Database connection failed, using fallback storage'
      });
    }

  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAdminAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // TODO: Implement actual post update with file system
    return NextResponse.json({
      success: true,
      message: 'Post update not yet implemented - will update MDX file',
      data: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Post update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAdminAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json(
        { error: 'Post ID or slug is required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual post deletion with file system
    return NextResponse.json({
      success: true,
      message: 'Post deletion not yet implemented - will delete MDX file',
      deletedId: id || slug
    });

  } catch (error) {
    console.error('Post deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}