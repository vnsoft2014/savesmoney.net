import { Store } from '@/shared/types';
import { ApiResponse } from '@/types';
import { fetcher } from '@/utils/utils';

export const getStoreById = async (id: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/store/${id}`, {
        method: 'GET',
    });

    return data;
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
