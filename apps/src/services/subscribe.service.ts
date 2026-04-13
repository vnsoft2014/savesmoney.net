import { getErrorMessage } from '@/lib/errorHandler';
import { fetcher } from '@/lib/utils';

type SubscribePayload = {
    [key: string]: any;
};

export const subscribeDeal = async (
    values: SubscribePayload,
    userId?: string,
    isRegisteredUser?: boolean,
    source: string = 'popup',
) => {
    try {
        const data = await fetcher('/api/subscriber/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                userId,
                isRegisteredUser,
                source,
            }),
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const checkDealSubscriber = async (email: string) => {
    try {
        const data = await fetcher('/api/subscribers/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
