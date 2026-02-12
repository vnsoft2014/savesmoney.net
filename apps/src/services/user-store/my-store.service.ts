import { getErrorMessage } from '@/utils/errorHandler';
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

export const createUserStore = async (formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store`, {
            method: 'POST',
            body: formData,
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const updateMyStoreSettings = async (formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store`, {
            method: 'PATCH',
            body: formData,
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
