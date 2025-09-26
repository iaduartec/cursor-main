import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Simple auth middleware function
export async function checkAdminAuth(request: NextRequest) {
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