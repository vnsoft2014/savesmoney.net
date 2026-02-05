import { MetadataRoute } from 'next';
import { SITE } from '@/utils/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard', '/api'],
            },
        ],
        sitemap: `${SITE.url}/sitemap/sitemap.xml`,
    };
}
