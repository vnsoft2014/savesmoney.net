import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    trailingSlash: false,
    basePath: '',
    poweredByHeader: false,

    reactCompiler: true,

    images: {
        formats: ['image/webp'],
    },

    async rewrites() {
        return [
            {
                source: '/sitemap/sm-stores-:page.xml',
                destination: '/sitemap/sm-stores/:page',
            },
            {
                source: '/sitemap/deals-:page.xml',
                destination: '/sitemap/deals/:page',
            },
        ];
    },
};

export default nextConfig;
