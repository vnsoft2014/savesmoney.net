import { SitemapItem } from '@/shared/types';

export const getSitemapJson = async (): Promise<SitemapItem[]> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/json`, {
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = (await res.json()) as SitemapItem[];

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

export const getDealsSitemapJson = async (page: number): Promise<SitemapItem[]> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/deals/${page}`, {
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = (await res.json()) as SitemapItem[];

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};
