import { getErrorMessage } from '@/lib/errorHandler';
import { fetcherWithAuth } from '@/lib/utils';

export async function uploadImage(formData: FormData) {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/deal/image`, {
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
}
