import { fetcherWithAuth } from '@/utils/utils';
import { getSession } from 'next-auth/react';

export const deleteSubscriber = async (id: string) => {
    const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/subscriber/${id}`, {
        method: 'DELETE',
    });

    return data;
};

export const exportSubscriber = async (query: string) => {
    const session = await getSession();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/subscriber/export?${query}`, {
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
