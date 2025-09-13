import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../../app/page';

// Mock Next.js metadata
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders hero section', () => {
    render(<Home />);
    expect(screen.getByText('Soluciones integrales en informática, videovigilancia, sonido y electricidad')).toBeInTheDocument();
  });

  it('renders main services', () => {
    render(<Home />);
    expect(screen.getByText('Informática')).toBeInTheDocument();
    // Los otros servicios están en el footer, no en la página principal
  });

  it('renders call to action', () => {
    render(<Home />);
    expect(screen.getByText('Solicita información')).toBeInTheDocument();
  });

  it('renders service area information', () => {
    render(<Home />);
    expect(screen.getAllByText(/Burgos/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Castilla y León/).length).toBeGreaterThan(0);
  });
});
