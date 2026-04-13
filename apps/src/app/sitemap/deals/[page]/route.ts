import { generateSitemapXml } from '@/lib/seo';
import { getDealsSitemapJson } from '@/services';
import { PropsWithPage, SitemapItem } from '@/types';
import { notFound } from 'next/navigation';

export async function GET(_: Request, { params }: PropsWithPage) {
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
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
        },
    });
}
