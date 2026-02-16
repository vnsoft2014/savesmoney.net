import { getErrorMessage } from '@/utils/errorHandler';
import { fetcherWithAuth } from '@/utils/utils';

import { DealListResponse, GetActiveDealsParams } from '@/shared/types';

export const addDeal = async (formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/deal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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

export const updateDeal = async (id: string, formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/deal/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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

export const getDeals = async (
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

        if (options?.expireAt) {
            params.append('expireAt', options.expireAt);
        } else {
            params.append('expireAt', 'null');
        }

        const data = await fetcherWithAuth(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/deal/list?${params.toString()}`,
            {
                method: 'GET',
                cache: 'no-store',
            },
        );

        if (!data.success) {
            throw new Error();
        }

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
