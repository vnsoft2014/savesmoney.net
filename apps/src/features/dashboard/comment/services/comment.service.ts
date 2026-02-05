import { fetcherWithAuth } from '@/utils/utils';

export const deleteComment = async (id: string) => {
    const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/comment/${id}`, {
        method: 'DELETE',
    });

    return data;
};

export const updateApprove = async (id: string, isApproved: boolean) => {
    const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/comment/${id}/approve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
        credentials: 'include',
    });

    return data;
};
