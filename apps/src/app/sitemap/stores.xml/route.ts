import { generateSitemapXml } from '@/lib/seo';
import { getStoresSitemapJson } from '@/services';
import { SitemapItem } from '@/types';

export async function GET() {
    const items: SitemapItem[] = await getStoresSitemapJson();

    const xml = generateSitemapXml(items);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
        },
    });
}
