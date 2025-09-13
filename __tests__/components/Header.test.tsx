import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../../components/header';

// Mock Next.js router
vi.mock('next/navigation', () => ({
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
