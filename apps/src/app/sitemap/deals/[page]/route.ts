import { notFound } from 'next/navigation';
import { getDealsSitemapJson } from '@/services/sitemap';
import { PagePropsWithSlug, SitemapItem } from '@/shared/types';
import { generateSitemapXml } from '@/utils/seo';

export async function GET(_: Request, { params }: PagePropsWithSlug) {
    const { page } = await params;

    if (!page) {
        return notFound();
    }

    const pageNum = parseInt(String(page), 10);
    if (isNaN(pageNum) || pageNum < 1) {
        return notFound();
    }

    const items: SitemapItem[] = await getDealsSitemapJson(pageNum);

    const xml = generateSitemapXml(items);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
