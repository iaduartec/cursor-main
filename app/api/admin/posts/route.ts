import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    // Get blog posts from mock data (replace with contentlayer when available)
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

    return NextResponse.json({ posts });

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
      
      const excerpt = content.substring(0, 160) + '...';
      const tagsJson = JSON.stringify(tags);
      
      const result = await sql`
        INSERT INTO posts (title, content, slug, excerpt, published, tags)
        VALUES (${title}, ${content}, ${slug}, ${excerpt}, ${published}, ${tagsJson})
        RETURNING id, title, slug, created_at
      `;
      
      return NextResponse.json({
        success: true,
        message: `Post "${title}" created successfully in database`,
        data: {
          ...data,
          id: result[0].id,
          createdAt: result[0].created_at,
          updatedAt: result[0].created_at,
          excerpt
        }
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      
      // Si la tabla no existe, crearla
      if (dbError.message?.includes('relation "posts" does not exist')) {
        try {
          const { neon } = require('@neondatabase/serverless');
          const sql = neon(process.env.DATABASE_URL!);
          
          await sql`
            CREATE TABLE posts (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              slug VARCHAR(255) UNIQUE NOT NULL,
              excerpt TEXT,
              published BOOLEAN DEFAULT false,
              author VARCHAR(100) DEFAULT 'Duartec Team',
              category VARCHAR(100) DEFAULT 'Blog',
              tags JSONB DEFAULT '[]',
              read_time VARCHAR(20) DEFAULT '5 min',
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `;
          
          // Reintentar inserción
          const excerpt = content.substring(0, 160) + '...';
          const tagsJson = JSON.stringify(tags);
          
          const result = await sql`
            INSERT INTO posts (title, content, slug, excerpt, published, tags)
            VALUES (${title}, ${content}, ${slug}, ${excerpt}, ${published}, ${tagsJson})
            RETURNING id, title, slug, created_at
          `;
          
          return NextResponse.json({
            success: true,
            message: `Post "${title}" created successfully (table created)`,
            data: {
              ...data,
              id: result[0].id,
              createdAt: result[0].created_at,
              updatedAt: result[0].created_at,
              excerpt
            }
          });
        } catch (createError) {
          console.error('Table creation error:', createError);
          return NextResponse.json(
            { error: 'Failed to create database table' },
            { status: 500 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to save post to database' },
        { status: 500 }
      );
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