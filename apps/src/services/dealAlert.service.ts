import { getErrorMessage } from '@/lib/errorHandler';
import { fetcher } from '@/lib/utils';
import { ApiResponse } from '@/types';
import { DealAlertPayload } from '@/types/dealAlert';

export async function addDealAlert(payload: DealAlertPayload): Promise<ApiResponse<void>> {
    try {
        const data: ApiResponse<void> = await fetcher('/api/deal-alert/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}
