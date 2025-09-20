<<<<<<< HEAD
import { render, screen } from '@testing-library/react';
=======
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
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
<<<<<<< HEAD
    expect(screen.getByText('947 256 430')).toBeInTheDocument();
    expect(screen.getByText('info@duartec.es')).toBeInTheDocument();
=======
    expect(screen.getByTestId('footer-phone')).toHaveTextContent('947 256 430');
    expect(screen.getByTestId('footer-email')).toHaveTextContent('info@duartec.es');
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Duartec/)).toBeInTheDocument();
  });
});
