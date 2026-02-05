import { ApiResponse } from '@/types';
import { DealAlertPayload } from '@/types/dealAlert';
import { getErrorMessage } from '@/utils/errorHandler';
import { fetcher } from '@/utils/utils';

export async function addDealAlert(payload: DealAlertPayload): Promise<ApiResponse<void>> {
    try {
        const data: ApiResponse<void> = await fetcher('/api/deal-alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!data.success) {
            throw new Error(data.message!);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}
