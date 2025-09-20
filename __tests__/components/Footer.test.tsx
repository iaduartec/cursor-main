import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../../components/footer';

describe('Footer Component', () => {
  it('renders company information', () => {
    render(<Footer />);
    expect(screen.getByText('Duartec')).toBeInTheDocument();
    expect(screen.getByText('Instalaciones Informáticas')).toBeInTheDocument();
  });

  it('renders service links', () => {
    render(<Footer />);
    expect(screen.getByText('Informática')).toBeInTheDocument();
    expect(screen.getByText('Videovigilancia')).toBeInTheDocument();
    expect(screen.getByText('Sonido Profesional')).toBeInTheDocument();
    expect(screen.getByText('Electricidad')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-phone')).toHaveTextContent('947 256 430');
    expect(screen.getByTestId('footer-email')).toHaveTextContent('info@duartec.es');
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Duartec/)).toBeInTheDocument();
  });
});
