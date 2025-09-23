import { SignIn } from '@stackframe/stack';

// Forzar renderizado del lado del cliente para evitar errores de prerenderizado
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  // Por ahora, simplemente mostrar el formulario de login
  // La lógica de redirección se puede implementar más tarde cuando las APIs estén estables
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Panel de Administración
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión para acceder al panel de administración
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
