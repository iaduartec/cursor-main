import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check against environment variable for admin password
    const adminPassword = process.env.ADMIN_PASSWORD || 'duartec2024';
    
    // Simple password check
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create simple token payload
    const tokenPayload = JSON.stringify({
      isAdmin: true,
      userId: 'admin',
      timestamp: Date.now(),
      expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    });

    // Simple base64 encoding for token
    const token = Buffer.from(tokenPayload).toString('base64');

    // Set HTTP-only cookie using response headers
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}