import { fetcherWithAuth } from '@/utils/utils';

export async function getOverviewStats() {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/overview/stats`, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!data.success) {
            throw new Error(data?.message || 'Failed to fetch stats');
        }

        return data.data;
    } catch (_: unknown) {
        return {
            totalDeals: 0,
            hotDeals: 0,
            invalidDeals: 0,
            activeDeals: 0,
            expiredDeals: 0,
            totalViews: 0,
            totalLikes: 0,
            totalPurchaseClicks: 0,
        };
    }
}

export async function getTopDeals() {
    try {
        const data = await fetcherWithAuth(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/overview/top-deals?limit=20`,
            {
                method: 'GET',
                cache: 'no-store',
            },
        );

        if (!data.success) {
            throw new Error(data?.message || 'Failed to fetch top deals');
        }

        return data.data;
    } catch (_: unknown) {
        return [];
    }
}

export async function getTopStores() {
    try {
        const data = await fetcherWithAuth(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/overview/top-stores?limit=20`,
            {
                method: 'GET',
                cache: 'no-store',
            },
        );

        if (!data.success) {
            throw new Error(data?.message || 'Failed to fetch top stores');
        }

        return data.data;
    } catch (_: unknown) {
        return [];
    }
}
