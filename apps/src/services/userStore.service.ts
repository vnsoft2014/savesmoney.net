import { fetcher } from '@/utils/utils';

export const getUserStoreById = async (id: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store/${id}`, {
        method: 'GET',
    });

    return data;
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
