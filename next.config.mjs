let withContentlayer = (c) => c;
if (process.env.SKIP_CONTENTLAYER !== '1') {
  try {
    // Dynamically import to avoid side-effects when skipping
    ({ withContentlayer } = await import('next-contentlayer'));
  } catch (err) {
    // If import fails, fall back to identity function
    withContentlayer = (c) => c;
  }
}

// Auto-skip Contentlayer on Windows to avoid compatibility issues
if (process.platform === 'win32' && process.env.SKIP_CONTENTLAYER !== '0') {
  console.warn('⚠️  Contentlayer compatibility warning on Windows - consider setting SKIP_CONTENTLAYER=1 for development');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },

  compress: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-UA-Compatible', value: 'IE=edge' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return [{ source: '/sitemap.xml', destination: '/api/sitemap' }];
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' },
        },
      };
    }

    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });

    // Silence optional OTel exporter resolution warnings
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@opentelemetry/exporter-jaeger': false,
    };

    return config;
  },

  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  trailingSlash: false,
  basePath: '',
  assetPrefix: '',
  poweredByHeader: false,
  // Disable React Strict Mode in dev to avoid double-mounting client maps
  reactStrictMode: false,

};

// Enable standalone output only on Vercel o cuando se solicita explícitamente,
// y evitarlo en Windows por problemas de symlink (EPERM) en entornos locales.
const enableStandalone =
  (process.env.VERCEL === '1' || process.env.ENABLE_STANDALONE === '1') && process.platform !== 'win32';
if (enableStandalone) {
  nextConfig.output = 'standalone';
}

// Permitir desactivar Contentlayer (útil para desarrollo en Windows o subproyectos)
const skipContentlayer = process.env.SKIP_CONTENTLAYER === '1';
const finalConfig = skipContentlayer ? nextConfig : withContentlayer(nextConfig);

export default finalConfig;
