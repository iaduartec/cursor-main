<<<<<<< HEAD
import { render, screen } from '@testing-library/react';
import Home from '../../app/page';

// Mock Next.js metadata
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
=======
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
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  }),
}));

describe('Home Page', () => {
  it('renders hero section', () => {
    render(<Home />);
<<<<<<< HEAD
    expect(screen.getByText('Soluciones integrales en informática, videovigilancia, sonido y electricidad')).toBeInTheDocument();
=======
    // El texto del H1 está dividido entre nodos (texto + span). Usamos un matcher flexible sobre textContent.
    const matcher = (content: string, node: Element | null) =>
      node?.textContent?.includes(
        'Soluciones integrales en informática, videovigilancia, sonido y electricidad'
      ) ?? false;
    expect(screen.getAllByText(matcher).length).toBeGreaterThan(0);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  });

  it('renders main services', () => {
    render(<Home />);
<<<<<<< HEAD
    expect(screen.getByText('Informática')).toBeInTheDocument();
=======
    expect(screen.getAllByText('Informática').length).toBeGreaterThan(0);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
    // Los otros servicios están en el footer, no en la página principal
  });

  it('renders call to action', () => {
    render(<Home />);
<<<<<<< HEAD
    expect(screen.getByText('Solicita información')).toBeInTheDocument();
=======
    expect(screen.getAllByText('Solicita información').length).toBeGreaterThan(0);
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  });

  it('renders service area information', () => {
    render(<Home />);
    expect(screen.getAllByText(/Burgos/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Castilla y León/).length).toBeGreaterThan(0);
  });
});
