import { fetcher } from '@/utils/utils';

type SubscribePayload = {
    [key: string]: any;
};

export const subscribeDeal = async (
    values: SubscribePayload,
    userId?: string,
    isRegisteredUser?: boolean,
    source: string = 'popup',
) => {
    const data = await fetcher('/api/deal-subscribers/subscribe', {
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

    if (!data.subscribed) {
        throw new Error(data.message);
    }

    return data;
};

export const checkDealSubscriber = async (email: string) => {
    const res = await fetch('/api/deal-subscribers/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error('Check deal subscriber failed');
    }

    return res.json();
};
