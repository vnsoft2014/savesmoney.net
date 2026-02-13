import { getDealsSitemapJson } from '@/services/sitemap';
import { SitemapItem } from '@/shared/types';
import { generateSitemapXml } from '@/utils/seo';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, context: { params: Promise<{ page: string }> }) {
    const { page } = await context.params;

    if (!page) {
        return notFound();
    }

    const pageNum = parseInt(page, 10);

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
