/**
Resumen generado automáticamente.

intranet-scaffold/app/admin/page.tsx

2025-09-13T06:20:07.373Z

——————————————————————————————
Archivo .tsx: page.tsx
Tamaño: 510 caracteres, 14 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
export default function AdminPage() {
  return (
    <main style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Panel de Administración - Intranet</h1>
          <p style={{ color: '#666', marginTop: 4 }}>
            Sistema de gestión de contenido Duartec
          </p>
        </div>
        <div>
          <a
            href='/logout'
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              <polyline points='16,17 21,12 16,7' />
              <line x1='21' y1='12' x2='9' y2='12' />
            </svg>
            Cerrar Sesión
          </a>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#f8fafc',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h2 style={{ marginTop: 0, color: '#1e293b' }}>Estado del Sistema</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginTop: 12,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 6,
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              ></div>
              <span style={{ fontWeight: '500', color: '#374151' }}>
                Base de Datos
              </span>
            </div>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              Conectado a Neon
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 6,
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              ></div>
              <span style={{ fontWeight: '500', color: '#374151' }}>
                Autenticación
              </span>
            </div>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              Sesión activa
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          border: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#1e293b' }}>
          Herramientas de Administración
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>
          Accede a las diferentes secciones del sistema:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          <a
            href='/admin/projects'
            style={{
              display: 'block',
              padding: 20,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s',
              backgroundColor: '#f8fafc',
            }}
            onMouseOver={e =>
              (e.currentTarget.style.backgroundColor = '#f1f5f9')
            }
            onMouseOut={e =>
              (e.currentTarget.style.backgroundColor = '#f8fafc')
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                >
                  <path d='M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10' />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>
                  CRUD Proyectos
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Crear, editar y eliminar proyectos
                </p>
              </div>
            </div>
          </a>

          <div
            style={{
              padding: 20,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              backgroundColor: '#f8fafc',
              opacity: 0.6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                >
                  <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#6b7280', fontSize: '18px' }}>
                  Servicios
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    color: '#9ca3af',
                    fontSize: '14px',
                  }}
                >
                  Próximamente disponible
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 20,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              backgroundColor: '#f8fafc',
              opacity: 0.6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                >
                  <path d='M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10' />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#6b7280', fontSize: '18px' }}>
                  Blog
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    color: '#9ca3af',
                    fontSize: '14px',
                  }}
                >
                  Próximamente disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: 8,
        }}
      >
        <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
          <strong>Nota:</strong> La interfaz está diseñada para evitar
          confirmaciones bloqueantes y facilitar las pruebas E2E y
          automatización.
        </p>
      </div>
    </main>
  );
}
