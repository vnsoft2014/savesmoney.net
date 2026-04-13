import { SITE } from '@/config/site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/signin',
                    '/signup',
                    '/forgot-password',
                    '/reset-password',
                    '/my-store',
                    '/my-store/*',
                    '/dashboard',
                    '/dashboard/*',
                    '/api',
                    '/api/*',
                ],
            },
        ],
        sitemap: `${SITE.url}/sitemap/sitemap.xml`,
    };
}
