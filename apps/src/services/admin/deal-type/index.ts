import { getErrorMessage } from '@/utils/errorHandler';
import { fetcher } from '@/utils/utils';

export const getDealTypeById = async (id: string) => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal-type/${id}`, {
            method: 'GET',
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
