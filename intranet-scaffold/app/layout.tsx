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
      <body>{children}</body>
    </html>
  )
}
