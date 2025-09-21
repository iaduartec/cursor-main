import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function LogoutPage() {
  // Eliminar cookie de sesión
  const cookieStore = await cookies();
  cookieStore.delete('intranet_token');

  // Redirigir al login
  redirect('/login');
}
