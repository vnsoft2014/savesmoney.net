import { getErrorMessage } from '@/utils/errorHandler';
import { fetcherWithAuth } from '@/utils/utils';

export const deleteValidation = async (id: string) => {
    try {
        const data = await fetcherWithAuth(`/api/admin/deal-validation/${id}`, {
            method: 'DELETE',
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

export const updateValidationStatus = async (dealId: string, invalid: boolean) => {
    try {
        const data = await fetcherWithAuth(`/api/admin/deal/${dealId}/validation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invalid }),
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
