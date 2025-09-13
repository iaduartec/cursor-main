/**
Resumen generado automáticamente.

__tests__/components/Header.test.tsx

2025-09-13T06:20:07.358Z

——————————————————————————————
Archivo .tsx: Header.test.tsx
Tamaño: 832 caracteres, 28 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { render, screen } from '@testing-library/react';
import Header from '../../components/header';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header Component', () => {
  it('renders company name', () => {
    render(<Header />);
    expect(screen.getByText('Duartec')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Header />);
    expect(screen.getByText('947 256 430')).toBeInTheDocument();
    expect(screen.getByText('info@duartec.es')).toBeInTheDocument();
  });
});
