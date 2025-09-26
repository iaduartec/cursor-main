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
    
    // Implementación real: crear archivo MDX
    const { title, content, slug, published = false, tags = [] } = data;
    
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      );
    }

    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Crear el contenido MDX
      const mdxContent = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${content.substring(0, 160)}..."
category: "Blog"
published: ${published}
author: "Duartec Team"
readTime: "5 min"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
---

${content}
`;

      // Asegurar que el directorio existe
      const contentDir = path.join(process.cwd(), 'content', 'blog');
      await fs.mkdir(contentDir, { recursive: true });
      
      // Escribir el archivo
      const filename = `${slug}.mdx`;
      const filepath = path.join(contentDir, filename);
      await fs.writeFile(filepath, mdxContent, 'utf-8');
      
      return NextResponse.json({
        success: true,
        message: `Post "${title}" created successfully`,
        data: {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          filepath: `content/blog/${filename}`
        }
      });
    } catch (fsError) {
      console.error('File system error:', fsError);
      return NextResponse.json(
        { error: 'Failed to create post file' },
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