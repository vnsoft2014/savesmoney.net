import { getSitemapJson } from '@/services';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const items = await getSitemapJson();

    return items.map((item) => ({
        url: item.loc.startsWith('http') ? item.loc : `${BASE_URL}${item.loc}`,

        lastModified: item.lastmod ? new Date(item.lastmod) : undefined,

        changeFrequency: item.changefreq as
            | 'always'
            | 'hourly'
            | 'daily'
            | 'weekly'
            | 'monthly'
            | 'yearly'
            | 'never'
            | undefined,

        priority: typeof item.priority === 'number' ? item.priority : undefined,
    }));
}
