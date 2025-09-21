import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    // Verificar token
    const expectedToken =
      process.env.INTRANET_DEBUG_TOKEN || process.env.ADMIN_TOKEN;
    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Establecer cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set('intranet_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Autenticación exitosa',
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Eliminar cookie de sesión
    const cookieStore = await cookies();
    cookieStore.delete('intranet_token');

    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
