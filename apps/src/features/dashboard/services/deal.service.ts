import { fetcherWithAuth } from '@/lib/utils';

import { getErrorMessage } from '@/lib/errorHandler';
import { DealFormValues } from '@/types';

export const addNewDeals = async (deals: DealFormValues[]) => {
    const payload = deals.map(({ id, ...rest }) => rest);

    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal`, {
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
};

export const deleteDeal = async (id: string) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal/${id}`, {
            method: 'DELETE',
        });

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};

export const updateDeal = async (id: string, formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal/${id}`, {
            method: 'PATCH',
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

export const checkDuplicate = async (shortDescription?: string, purchaseLink?: string, dealId?: string) => {
    try {
        if (!shortDescription && !purchaseLink) {
            return {
                success: true,
                isDuplicate: false,
            };
        }

        const body: Record<string, any> = {};

        if (shortDescription) body.shortDescription = shortDescription;
        if (purchaseLink) body.purchaseLink = purchaseLink;
        if (dealId) body.dealId = dealId;

        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deals/check-duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return data.isDuplicate;
    } catch (error) {
        return false;
    }
};

export const getDealById = async (id: string, populate = false) => {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal/${id}`);

        if (populate) {
            url.searchParams.append('populate', 'true');
        }

        const data = await fetcherWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-cache',
        });

        return data;
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
};
