import { Metadata } from 'next';

export interface OpenGraphProps {
  title: string;
  description: string;
  url?: string;
  siteName?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'video.movie' | 'video.episode' | 'music.song' | 'profile';
  locale?: string;
  alternateLocales?: string[];
  // Para artículos
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  // Para videos
  videoUrl?: string;
  videoType?: string;
  videoWidth?: number;
  videoHeight?: number;
  // Para audio
  audioUrl?: string;
  audioType?: string;
}

/**
 * Genera metadatos completos de Open Graph para Next.js App Router
 */
export function generateOpenGraphMetadata({
  title,
  description,
  url,
  siteName = 'Duartec Instalaciones Informáticas',
  image,
  imageAlt,
  type = 'website',
  locale = 'es_ES',
  alternateLocales = ['en_US'],
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  videoUrl,
  videoType,
  videoWidth,
  videoHeight,
  audioUrl,
  audioType,
}: OpenGraphProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.duartec.es';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/images/og-default.webp`;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@duartec_es',
      creator: '@duartec_es',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
      languages: alternateLocales.reduce((acc, lang) => {
        acc[lang] = `${baseUrl}/${lang}`;
        return acc;
      }, {} as Record<string, string>),
    },
  };

  // Agregar propiedades específicas según el tipo
  if (type === 'article' && metadata.openGraph) {
    // @ts-expect-error - Next.js types don't include all OG properties
    metadata.openGraph.publishedTime = publishedTime;
    // @ts-expect-error
    metadata.openGraph.modifiedTime = modifiedTime;
    // @ts-expect-error
    metadata.openGraph.authors = author ? [author] : undefined;
    // @ts-expect-error
    metadata.openGraph.section = section;
    // @ts-expect-error
    metadata.openGraph.tags = tags;
  }

  if (videoUrl && metadata.openGraph) {
    metadata.openGraph.videos = [
      {
        url: videoUrl,
        type: videoType,
        width: videoWidth,
        height: videoHeight,
      },
    ];
  }

  if (audioUrl && metadata.openGraph) {
    metadata.openGraph.audio = [
      {
        url: audioUrl,
        type: audioType,
      },
    ];
  }

  // Añadir locales alternativos
  if (alternateLocales.length > 0) {
    // @ts-expect-error - Next.js types don't include all OG properties
    metadata.openGraph.alternateLocale = alternateLocales;
  }

  return metadata;
}

/**
 * Genera metadatos específicos para páginas de servicios
 */
export function generateServiceOpenGraph(service: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}): Metadata {
  return generateOpenGraphMetadata({
    title: `${service.title} - Servicios | Duartec`,
    description: service.description,
    url: `/servicios/${service.slug}`,
    image: service.image,
    imageAlt: `Servicio de ${service.title} - Duartec Instalaciones Informáticas`,
    type: 'website',
    section: 'Servicios',
    tags: ['servicios', 'instalaciones', 'burgos', service.title.toLowerCase()],
  });
}

/**
 * Genera metadatos específicos para proyectos
 */
export function generateProjectOpenGraph(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  date?: string;
}): Metadata {
  return generateOpenGraphMetadata({
    title: `${project.title} - Proyecto | Duartec`,
    description: project.description,
    url: `/proyectos/${project.slug}`,
    image: project.image,
    imageAlt: `Proyecto ${project.title} - Duartec Instalaciones Informáticas`,
    type: 'article',
    section: 'Proyectos',
    publishedTime: project.date,
    tags: ['proyectos', 'instalaciones', 'burgos', 'casos-exito'],
  });
}

/**
 * Genera metadatos específicos para artículos del blog
 */
export function generateBlogOpenGraph(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  tags?: string[];
}): Metadata {
  return generateOpenGraphMetadata({
    title: `${article.title} | Blog Duartec`,
    description: article.description,
    url: `/blog/${article.slug}`,
    image: article.image,
    imageAlt: `${article.title} - Blog Técnico Duartec`,
    type: 'article',
    publishedTime: article.publishedDate,
    modifiedTime: article.modifiedDate,
    author: article.author || 'Duartec Instalaciones Informáticas',
    section: article.category || 'Blog Técnico',
    tags: article.tags || ['blog', 'tecnico', 'instalaciones'],
  });
}

/**
 * Genera metadatos específicos para streaming/cámaras
 */
export function generateStreamingOpenGraph(stream: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  videoUrl?: string;
}): Metadata {
  return generateOpenGraphMetadata({
    title: `Streaming ${stream.name} - Cámara en directo | Duartec`,
    description: stream.description || `Emisión 24 horas desde ${stream.name} (Burgos)`,
    url: `/streaming/${stream.slug}`,
    image: stream.image,
    imageAlt: `Streaming en directo desde ${stream.name}`,
    type: 'video.episode',
    section: 'Streaming',
    tags: ['streaming', 'camara', 'directo', 'burgos'],
    videoUrl: stream.videoUrl,
    videoType: 'video/mp4',
    videoWidth: 1920,
    videoHeight: 1080,
  });
}