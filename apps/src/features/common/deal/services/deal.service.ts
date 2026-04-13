import { getErrorMessage } from '@/lib/errorHandler';
import { fetcherWithAuth } from '@/lib/utils';

export async function touchDeal(dealId: string) {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal/${dealId}/touch`, {
            method: 'POST',
        });

        if (!data?.success) {
            throw new Error(data?.message || 'Failed to refresh deal');
        }

        return data;
    } catch (error: unknown) {
        console.error(error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}
