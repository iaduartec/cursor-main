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
        {process.env.INTRANET_DEBUG_TOKEN && process.env.NODE_ENV !== 'production' ? (
          <script dangerouslySetInnerHTML={{ __html: `window.__INTRANET_DEBUG_TOKEN = ${JSON.stringify(process.env.INTRANET_DEBUG_TOKEN)}` }} />
        ) : null}
      </body>
    </html>
  )
}
