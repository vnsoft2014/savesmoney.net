import { fetcher, fetcherWithAuth } from '@/utils/utils';

export const getUserStoreByUserId = async (userId: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store/check?userId=${userId}`, {
        method: 'GET',
    });

    return data;
};

export const getUserStoreById = async (id: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store/${id}`, {
        method: 'GET',
    });

    return data;
};

export const getUserStore = async () => {
    const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store`, {
        method: 'GET',
    });

    return data;
};

export const getUserStores = async (sort: string, page: number) => {
    try {
        const data = await fetcher(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store/list?sort=${sort}&page=${page}&limit=30`,
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
