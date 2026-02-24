import { SitemapItem } from '@/shared/types';
import { fetcher } from '@/utils/utils';

export const getSitemapJson = async (): Promise<SitemapItem[]> => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/json`, {
            cache: 'no-store',
        });

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

export const getDealsSitemapJson = async (page: number): Promise<SitemapItem[]> => {
    try {
        const data: SitemapItem[] = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/deals/${page}`, {
            cache: 'no-store',
        });

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

export const getDealTypesSitemapJson = async (): Promise<SitemapItem[]> => {
    try {
        const data: SitemapItem[] = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/deal-types`, {
            cache: 'no-store',
        });

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

export const getStoresSitemapJson = async (): Promise<SitemapItem[]> => {
    try {
        const data: SitemapItem[] = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/stores`, {
            cache: 'no-store',
        });

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};

export const getSMStoresSitemapJson = async (page: number): Promise<SitemapItem[]> => {
    try {
        const data: SitemapItem[] = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap/sm-stores/${page}`, {
            cache: 'no-store',
        });

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
};
