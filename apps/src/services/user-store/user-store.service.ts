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
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store`, {
            method: 'GET',
        });

        if (!data.success) {
            throw new Error(data.message!);
        }

        return data.data;
    } catch (error: unknown) {
        return { name: '', website: '', description: '', logo: '' };
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
