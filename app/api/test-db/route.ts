import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    console.log('[TEST] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('[TEST] DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        error: 'No DATABASE_URL env var',
        env: process.env.NODE_ENV
      });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql`SELECT COUNT(*) as count FROM posts`;
    const count = parseInt(result[0]?.count || '0');
    
    const samplePosts = await sql`SELECT id, title, slug FROM posts LIMIT 3`;
    
    return NextResponse.json({
      success: true,
      postsCount: count,
      samplePosts,
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[TEST] Database error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      env: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL
    }, { status: 500 });
  }
}