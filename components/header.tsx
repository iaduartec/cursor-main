'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className='w-full bg-slate-800 dark:bg-slate-900 shadow-lg sticky top-0 z-50'>
      {/* Top bar con información de contacto */}
      <div className='bg-accent text-white py-2 px-4'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm'>
          <div className='flex flex-col sm:flex-row items-center gap-4 mb-2 sm:mb-0'>
            <a
              href='tel:+34947256430'
              className='flex items-center gap-1 hover:underline'
            >
              <Phone className='w-4 h-4' />
              <span>947 256 430</span>
            </a>
            <a
              href='mailto:fjduarte@duartec.es'
              className='flex items-center gap-1 hover:underline'
            >
              <Mail className='w-4 h-4' />
              <span>fjduarte@duartec.es</span>
            </a>
          </div>
          <div className='text-xs text-center'>
            Horario: L-V 9:00-18:00 | Emergencias 24/7
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className='max-w-6xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center group'
            aria-label='Inicio'
          >
            <Image
              src='/images/logo.png'
              alt='Duartec'
              width={80}
              height={80}
              className='h-20 w-auto group-hover:opacity-80 transition-opacity'
              priority
            />
            {/* Texto eliminado: el logo ya incluye la marca */}
            <div className='leading-tight hidden'>
              <span className='text-white font-bold text-lg'>Duartec</span>
              <span className='text-sm text-gray-200'>
                Instalaciones Informáticas
              </span>
            </div>
          </Link>

          {/* Navegación desktop */}
          <nav className='hidden md:block' aria-label='Navegación principal'>
            <ul className='flex gap-8'>
              <li>
                <Link
                  href='/'
                  className='text-white hover:text-accent transition-colors font-medium'
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href='/servicios'
                  className='text-white hover:text-accent transition-colors font-medium'
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href='/proyectos'
                  className='text-white hover:text-accent transition-colors font-medium'
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  href='/streaming'
                  className='text-white hover:text-accent transition-colors font-medium'
                >
                  Streaming 24h
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-white hover:text-accent transition-colors font-medium'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/quienes-somos'
                  className='text-white hover:text-accent transition-colors font-medium'
                >
                  Quiénes somos
                </Link>
              </li>
              <li>
                <Link
                  href='/contacto'
                  className='bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors font-medium'
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>

          {/* Botón menú móvil */}
          <button
            onClick={toggleMenu}
            className='md:hidden p-2 text-white hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-md'
            aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <>
            {/* Backdrop para cerrar el menú al hacer clic fuera */}
            <div 
              className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
              onClick={closeMenu}
              aria-hidden='true'
            />
            <nav
              className='md:hidden mt-4 pb-4 border-t border-slate-600 relative z-50 bg-slate-800'
              aria-label='Navegación móvil'
            >
              <ul className='flex flex-col gap-2 pt-4'>
                <li>
                  <Link
                    href='/'
                    onClick={closeMenu}
                    className='block text-white hover:text-accent transition-colors font-medium py-3 px-2 rounded-md hover:bg-slate-700'
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href='/servicios'
                    onClick={closeMenu}
                    className='block text-white hover:text-accent transition-colors font-medium py-3 px-2 rounded-md hover:bg-slate-700'
                  >
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link
                    href='/proyectos'
                    onClick={closeMenu}
                    className='block text-white hover:text-accent transition-colors font-medium py-3 px-2 rounded-md hover:bg-slate-700'
                  >
                    Proyectos
                  </Link>
                </li>
                <li>
                  <Link
                    href='/streaming'
                    onClick={closeMenu}
                    className='block text-white hover:text-accent transition-colors font-medium py-3 px-2 rounded-md hover:bg-slate-700'
                  >
                    Streaming 24h
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog'
                    onClick={closeMenu}
                    className='block text-white hover:text-accent transition-colors font-medium py-3 px-2 rounded-md hover:bg-slate-700'
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href='/quienes-somos'
                    onClick={closeMenu}
                    className='block text-white hover:text-accent transition-colors font-medium py-3 px-2 rounded-md hover:bg-slate-700'
                  >
                    Quiénes somos
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contacto'
                    onClick={closeMenu}
                    className='block bg-accent text-white px-4 py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium text-center mt-2'
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
