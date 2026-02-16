import { getErrorMessage } from '@/utils/errorHandler';
import { fetcherWithAuth } from '@/utils/utils';

export const createUserStore = async (formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store`, {
            method: 'POST',
            body: formData,
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

export const updateMyStoreSettings = async (formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/store`, {
            method: 'PATCH',
            body: formData,
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
