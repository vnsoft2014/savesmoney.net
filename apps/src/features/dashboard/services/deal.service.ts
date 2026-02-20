import { fetcherWithAuth } from '@/utils/utils';

export const getDealById = async (id: string, populate = false) => {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal/${id}`);

        if (populate) {
            url.searchParams.append('populate', 'true');
        }

        const data = await fetcherWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-cache',
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data;
    } catch (error) {
        return null;
    }
};
