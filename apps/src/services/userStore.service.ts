import { getErrorMessage } from '@/lib/errorHandler';
import { fetcher } from '@/lib/utils';

export const getUserStoreById = async (id: string) => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store/${id}`, {
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

export const getUserStores = async (sort: string, page: number, search: string) => {
    try {
        const params = new URLSearchParams();

        params.set('sort', sort);
        params.set('page', page.toString());

        if (search) {
            params.set('search', search);
        }

        const data = await fetcher(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store/list?${params.toString()}`,
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
                limit: 30,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }
};
