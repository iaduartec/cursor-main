// Fallback data when Contentlayer is disabled
const fallbackServices = [
  {
    id: 1,
    slug: 'informatica',
    title: 'Instalaciones Informáticas',
    description: 'Instalación y mantenimiento de equipos informáticos, redes, servidores y sistemas de comunicación.',
    image: '/images/services/informatica.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  },
  {
    id: 2,
    slug: 'videovigilancia',
    title: 'Videovigilancia y CCTV',
    description: 'Instalación de sistemas de videovigilancia, cámaras IP, grabadores DVR y software de gestión.',
    image: '/images/services/videovigilancia.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  },
  {
    id: 3,
    slug: 'sonido',
    title: 'Sonido Profesional',
    description: 'Instalación de sistemas de sonido profesional para eventos, locales comerciales y espacios públicos.',
    image: '/images/services/sonido.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  },
  {
    id: 4,
    slug: 'electricidad',
    title: 'Instalaciones Eléctricas',
    description: 'Instalaciones eléctricas industriales y domésticas, certificaciones y mantenimiento.',
    image: '/images/services/electricidad.jpg',
    areaServed: 'Burgos y Castilla y León',
    hasOfferCatalog: true
  }
];

export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  areaServed: string | null;
  hasOfferCatalog: boolean;
};

export async function getAllServices(): Promise<ServiceRow[]> {
  return fallbackServices;
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const services = await getAllServices();
  return services.find(service => service.slug === slug) || null;
}

export async function getServicesByCategory(category: string): Promise<ServiceRow[]> {
  const services = await getAllServices();
  return services.filter(service => service.slug.includes(category));
}

export async function getFeaturedServices(): Promise<ServiceRow[]> {
  const services = await getAllServices();
  return services.slice(0, 4);
}
