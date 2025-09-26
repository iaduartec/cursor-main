import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock data for development
const mockStats = {
  posts: 12,
  services: 8,
  projects: 15,
  streams: 3
};

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

    // Get stats from mock data (replace with contentlayer when available)
    const stats = mockStats;

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}