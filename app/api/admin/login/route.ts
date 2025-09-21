import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get('token') || '');
  const expected = process.env.ADMIN_TOKEN || '';
  if (expected && token === expected) {
    const res = NextResponse.redirect(new URL('/admin', req.url));
    res.cookies.set('admin', token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
    return res;
  }
  return NextResponse.redirect(new URL('/admin/login?error=1', req.url));
}

