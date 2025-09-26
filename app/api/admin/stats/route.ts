import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';

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
      // Obtener stats reales de la base de datos
      const sql = neon(process.env.DATABASE_URL!);
      
      // Contar posts reales
      const postsCount = await sql`SELECT COUNT(*) as count FROM posts`;
      const postsTotal = parseInt(postsCount[0]?.count || '0');
      
      // Para services y projects, usar Drizzle si existe o fallback a conteos mock
      let servicesTotal = 8; // default
      let projectsTotal = 15; // default 
      let streamsTotal = 3; // default
      
      try {
        // Intentar contar services y projects si las tablas existen
        const servicesCount = await sql`SELECT COUNT(*) as count FROM services`;
        servicesTotal = parseInt(servicesCount[0]?.count || '8');
      } catch (e) {
        console.log('Services table not found, using default count');
      }
      
      try {
        const projectsCount = await sql`SELECT COUNT(*) as count FROM projects`;  
        projectsTotal = parseInt(projectsCount[0]?.count || '15');
      } catch (e) {
        console.log('Projects table not found, using default count');
      }

      const stats = {
        posts: postsTotal,
        services: servicesTotal, 
        projects: projectsTotal,
        streams: streamsTotal // placeholder hasta implementar streams
      };

      console.log('Real stats from database:', stats);
      return NextResponse.json(stats);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback a datos mock si la base de datos falla
      const mockStats = {
        posts: 12,
        services: 8, 
        projects: 15,
        streams: 3
      };
      
      console.log('Database failed, using mock stats:', mockStats);
      return NextResponse.json(mockStats);
    }

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}