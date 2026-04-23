import { getDateRangeFromToday } from '@/lib/deal';
import { getErrorMessage } from '@/lib/errorHandler';
import { getEmptySearchResult } from '@/lib/search';
import { fetcher } from '@/lib/utils';
import { ApiResponse, DealFull, DealListResponse, GetActiveDealsParams } from '@/types';

export const getActiveDeals = async (
    dealType?: string,
    dealStore?: string,
    page: number = 1,
    options?: GetActiveDealsParams,
): Promise<DealListResponse> => {
    try {
        const today = new Date().toISOString();

        const params = new URLSearchParams({
            expireAtFrom: today,
            sortField: options?.sortField || 'createdAt',
            sortOrder: options?.sortOrder || 'desc',
            limit: String(options?.limit ?? 30),
            page: String(page),
        });

        if (dealType) params.append('dealType', dealType);
        if (dealStore) params.append('dealStore', dealStore);

        if (options?.search) params.append('search', options.search);

        if (typeof options?.hotTrend === 'boolean') {
            params.append('hotTrend', String(options.hotTrend));
        }

        if (typeof options?.holidayDeals === 'boolean') {
            params.append('holidayDeals', String(options.holidayDeals));
        }

        if (typeof options?.seasonalDeals === 'boolean') {
            params.append('seasonalDeals', String(options.seasonalDeals));
        }

        if (options?.expireAt) {
            params.append('expireAt', options.expireAt);
        } else {
            params.append('expireAt', 'null');
        }

        if (options?.author) params.append('author', options.author);

        if (options?.userStore) params.append('userStore', options.userStore);

        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/list?${params.toString()}`, {
            method: 'GET',
            cache: 'no-store',
        });

        return data;
    } catch (_: unknown) {
        return {
            data: [],
            pagination: {
                currentPage: page,
                totalPages: 0,
                totalCount: 0,
                limit: options?.limit ?? 30,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }
};

export const getExpiringSoon = async (
    dealType?: string,
    dealStore?: string,
    page: number = 1,
): Promise<DealListResponse> => {
    try {
        const dateRange = getDateRangeFromToday(3);

        const params = new URLSearchParams({
            expireAtFrom: dateRange.startDate,
            expireAtTo: dateRange.endDate,
            sortField: 'createdAt',
            sortOrder: 'desc',
            limit: '30',
            page: page.toString(),
        });

        if (dealType) {
            params.append('dealType', dealType);
        }

        if (dealStore) {
            params.append('dealStore', dealStore);
        }

        params.append('expireAt', 'null');

        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/list?${params.toString()}`, {
            method: 'GET',
            cache: 'no-store',
        });

        return data;
    } catch (_: unknown) {
        return {
            data: [],
            pagination: {
                currentPage: page,
                totalPages: 0,
                totalCount: 0,
                limit: 30,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }
};

export const getDealById = async (id: string, populate = false) => {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/${id}`);

        if (populate) {
            url.searchParams.append('populate', 'true');
        }

        const data: ApiResponse<DealFull> = await fetcher(url.toString(), {
            method: 'GET',
            cache: 'no-cache',
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const countView = async (dealId: string) => {
    try {
        await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/${dealId}/view`, { method: 'POST' });
    } catch (_: unknown) {}
};

export const getDealStats = async (dealId: string) => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/${dealId}/stats`, {
            method: 'GET',
            cache: 'no-store',
        });

        return data;
    } catch (_: unknown) {
        return {
            views: 0,
            likes: 0,
            comments: 0,
            likedBy: [],
        };
    }
};

export const getTopViewedDeals = async () => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deals/top-views`, {
            method: 'GET',
            cache: 'no-store',
        });

        return data.data;
    } catch (_: unknown) {
        return [];
    }
};

export const searchDeals = async (
    query: string,
    page = 1,
    limit = 10,
    dealType?: string,
    dealStore?: string,
    signal?: AbortSignal,
) => {
    try {
        const params = new URLSearchParams({
            query,
            page: page.toString(),
            limit: limit.toString(),
        });

        if (dealType) params.append('dealType', dealType);
        if (dealStore) params.append('dealStore', dealStore);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?${params.toString()}`, { signal });

        if (!res.ok) {
            throw new Error('Search API failed');
        }

        const data = await res.json();

        if (!data?.success) {
            return getEmptySearchResult(page, limit);
        }

        return data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            return getEmptySearchResult(page, limit);
        }

        console.error('searchDeals error:', error);

        return getEmptySearchResult(page, limit);
    }
};

type RelatedDealsResponse = {
    success: boolean;
    data: DealFull[];
};

export const getRelatedDeals = async (dealId: string, storeId: string, limit = 24): Promise<DealFull[]> => {
    try {
        const params = new URLSearchParams({
            dealId,
            store: storeId,
            limit: limit.toString(),
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/common/deal/related?${params}`, {
            cache: 'force-cache',
        });

        if (!res.ok) return [];

        const data: RelatedDealsResponse = await res.json();

        return data?.success ? data.data : [];
    } catch (error) {
        console.error('getRelatedDeals error', error);

        return [];
    }
};
