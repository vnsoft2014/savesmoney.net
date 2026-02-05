import { DealType } from '@/shared/types';
import { ApiResponse } from '@/types';
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

export const getDealTypes = async (): Promise<DealType[]> => {
    try {
        const res: ApiResponse<DealType[]> = await fetcher(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal-type/all`,
            {
                method: 'GET',
                cache: 'no-store',
            },
        );
        if (!res.success) {
            throw new Error(res.message || 'Failed to fetch deal types');
        }

        return res.data!;
    } catch (_: unknown) {
        return [];
    }
};
