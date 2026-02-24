import { getErrorMessage } from '@/utils/errorHandler';
import { fetcherWithAuth } from '@/utils/utils';

export const updateSettings = async (formData: FormData) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/settings`, {
            method: 'POST',
            body: formData,
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
