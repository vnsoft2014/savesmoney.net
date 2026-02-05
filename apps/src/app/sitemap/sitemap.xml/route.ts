import { getSitemapJson } from '@/services/sitemap';
import { SitemapItem } from '@/shared/types';
import { generateSitemapXml } from '@/utils/seo';

export async function GET() {
    const items: SitemapItem[] = await getSitemapJson();

    const xml = generateSitemapXml(items);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
