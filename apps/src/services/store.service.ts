import { getErrorMessage } from '@/lib/errorHandler';
import { fetcher } from '@/lib/utils';
import { ApiResponse, Store } from '@/types';

export const getStoreById = async (id: string) => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/store/${id}`, {
            method: 'GET',
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const getStores = async (): Promise<Store[]> => {
    try {
        const res: ApiResponse<Store[]> = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/store/all`, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!res.success) {
            throw new Error(res.message || 'Failed to fetch stores');
        }

        return res.data!;
    } catch (error: unknown) {
        return [];
    }
};
