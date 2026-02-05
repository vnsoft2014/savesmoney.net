import { fetcher, fetcherWithAuth } from '@/utils/utils';
import { getSession } from 'next-auth/react';

export const exportUser = async (query: string) => {
    const session = await getSession();

    const response = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/export?${query}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Export failed');
    }

    return response;
};

export const getUserById = async (id: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/user/${id}`);

    return data;
};
