'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check');
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginForm.password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md w-full space-y-8 p-8">
          {/* Logo y Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Panel de Administración
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de gestión de contenido Duartec
            </p>
          </div>

          {/* Formulario de Login */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña de Administrador
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 transition-all duration-200"
                  placeholder="Ingresa tu contraseña"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Iniciar Sesión
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              ← Volver al sitio web
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState({
    posts: 0,
    services: 0,
    projects: 0,
    streams: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Duartec Admin</h1>
                <p className="text-xs text-gray-500">Sistema de gestión de contenido</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Ver sitio
              </Link>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Panel de Control</h2>
            <p className="mt-2 text-gray-600">Gestiona todo el contenido de tu sitio web desde aquí</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Posts del Blog"
              value={stats.posts}
              icon="📝"
              color="blue"
              href="/admin/posts"
            />
            <StatsCard
              title="Servicios"
              value={stats.services}
              icon="🔧"
              color="green"
              href="/admin/services"
            />
            <StatsCard
              title="Proyectos"
              value={stats.projects}
              icon="📁"
              color="purple"
              href="/admin/projects"
            />
            <StatsCard
              title="Streaming"
              value={stats.streams}
              icon="📹"
              color="red"
              href="/admin/streams"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionCard
                  title="Crear Post"
                  description="Nuevo artículo para el blog"
                  icon="➕"
                  href="/admin/posts/new"
                  color="blue"
                />
                <ActionCard
                  title="Añadir Servicio"
                  description="Nuevo servicio de la empresa"
                  icon="🔧"
                  href="/admin/services/new"
                  color="green"
                />
                <ActionCard
                  title="Nuevo Proyecto"
                  description="Caso de éxito o proyecto"
                  icon="📁"
                  href="/admin/projects/new"
                  color="purple"
                />
                <ActionCard
                  title="Configurar Stream"
                  description="Nueva cámara en vivo"
                  icon="📹"
                  href="/admin/streams/new"
                  color="red"
                />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusItem
                  title="Base de Datos"
                  status="online"
                  description="Neon PostgreSQL (Frankfurt)"
                />
                <StatusItem
                  title="OpenAI API"
                  status="online"
                  description="Optimización SEO activa"
                />
                <StatusItem
                  title="Vercel Deployment"
                  status="online"
                  description="Última actualización: hace 2 horas"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value, icon, color, href }: {
  title: string;
  value: number;
  icon: string;
  color: string;
  href: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <Link href={href} className="group">
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
        <div className="p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-xl shadow-lg`}>
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="text-2xl font-bold text-gray-900">{value}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ActionCard({ title, description, icon, href, color }: {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
    green: 'border-green-200 hover:border-green-300 hover:shadow-green-100',
    purple: 'border-purple-200 hover:border-purple-300 hover:shadow-purple-100',
    red: 'border-red-200 hover:border-red-300 hover:shadow-red-100',
  };

  return (
    <Link href={href} className="group">
      <div className={`border-2 rounded-lg p-4 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105 ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatusItem({ title, status, description }: {
  title: string;
  status: 'online' | 'offline' | 'warning';
  description: string;
}) {
  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-red-400',
    warning: 'bg-yellow-400',
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`w-3 h-3 rounded-full ${statusColors[status]} shadow-sm`}></div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
