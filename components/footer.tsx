import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white">
      {/* Contenido principal del footer */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/images/logo.png"
                alt="Duartec"
                width={56}
                height={56}
                className="h-14 w-auto"
                loading="lazy"
              />
              <div className="ml-2">
                <div className="text-lg font-bold">Duartec</div>
                <div className="text-sm text-gray-300">Instalaciones Informáticas</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Más de 10 años de experiencia en instalaciones informáticas, videovigilancia, 
              sonido y electricidad en Burgos y Castilla y León. Calidad y profesionalidad garantizadas.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/duartec" className="text-gray-400 hover:text-accent transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/duartec" className="text-gray-400 hover:text-accent transition-colors" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/duartec" className="text-gray-400 hover:text-accent transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/duartec" className="text-gray-400 hover:text-accent transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios/informatica" className="text-gray-300 hover:text-accent transition-colors">
                  Informática
                </Link>
              </li>
              <li>
                <Link href="/servicios/videovigilancia" className="text-gray-300 hover:text-accent transition-colors">
                  Videovigilancia
                </Link>
              </li>
              <li>
                <Link href="/servicios/sonido" className="text-gray-300 hover:text-accent transition-colors">
                  Sonido Profesional
                </Link>
              </li>
              <li>
                <Link href="/servicios/electricidad" className="text-gray-300 hover:text-accent transition-colors">
                  Electricidad
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-accent transition-colors">
                  Ver todos los servicios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:+34947256430" className="text-gray-300 hover:text-accent transition-colors">
                  947 256 430
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:info@duartec.es" className="text-gray-300 hover:text-accent transition-colors">
                  info@duartec.es
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-gray-300">Burgos, España</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-gray-300">L-V 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-slate-700">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Duartec Instalaciones Informáticas. Todos los derechos reservados.</p>
            </div>

            {/* Enlaces legales */}
            <nav className="flex flex-wrap gap-4 text-sm">
              <Link href="/legal/aviso-legal" className="text-gray-400 hover:text-accent transition-colors">
                Aviso legal
              </Link>
              <Link href="/legal/privacidad" className="text-gray-400 hover:text-accent transition-colors">
                Política de privacidad
              </Link>
              <Link href="/legal/cookies" className="text-gray-400 hover:text-accent transition-colors">
                Política de cookies
              </Link>
              <Link href="/legal/condiciones" className="text-gray-400 hover:text-accent transition-colors">
                Condiciones de uso
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-slate-950 py-4 px-4">
        <div className="max-w-6xl mx-auto text-center text-xs text-gray-500">
          <p>
            Empresa registrada en Burgos | CIF: B00000000 | Inscrita en el Registro Mercantil de Burgos
          </p>
          <p className="mt-1">
            Certificaciones: ISO 9001, ISO 14001 | Miembro de la Asociación de Empresas de Instalaciones de Burgos
          </p>
        </div>
      </div>
    </footer>
  );
}
