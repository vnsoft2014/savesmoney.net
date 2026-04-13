import { getErrorMessage } from '@/lib/errorHandler';
import { fetcherWithAuth } from '@/lib/utils';
import { getSession } from 'next-auth/react';

export const deleteSubscriber = async (id: string) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/subscriber/${id}`, {
            method: 'DELETE',
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
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
