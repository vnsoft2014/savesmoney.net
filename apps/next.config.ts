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

    async headers() {
        return [
            {
                source: '/api/upload/deal/image',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
            {
                source: '/api/admin/deal/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
            {
                source: '/api/common/store/all',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
            {
                source: '/api/common/deal-type/all',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ];
    },
};

export default nextConfig;
