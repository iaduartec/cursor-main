/**
Resumen generado automáticamente.

intranet-scaffold/app/layout.tsx

2025-09-13T06:20:07.374Z

——————————————————————————————
Archivo .tsx: layout.tsx
Tamaño: 655 caracteres, 25 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import '../styles/globals.css';

export const metadata = {
  title: 'Duartec Intranet',
  description: 'Scaffold de intranet de Duartec',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* Expose debug token to client in non-production for E2E runs only */}
  {/* eslint-disable react/no-danger */}
  {process.env.INTRANET_DEBUG_TOKEN && process.env.NODE_ENV !== 'production' ? (
          // The debug token is injected only in non-production for E2E runs. It's serialized
          // with JSON.stringify to ensure it's a safe string. Keep this conditional minimal and
          // do not expose in production.
          <script dangerouslySetInnerHTML={{ __html: `window.__INTRANET_DEBUG_TOKEN = ${JSON.stringify(process.env.INTRANET_DEBUG_TOKEN)}` }} />
        ) : null}
  {/* eslint-enable react/no-danger */}
      </body>
    </html>
  )
}
