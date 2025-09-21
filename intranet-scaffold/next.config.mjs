/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.ENABLE_STANDALONE === '1' ? 'standalone' : undefined,
    experimental: {
        scrollRestoration: true,
    },
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;