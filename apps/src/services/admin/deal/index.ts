import { DealFormValues } from '@/shared/types';
import { getErrorMessage } from '@/utils/errorHandler';
import { fetcherWithAuth } from '@/utils/utils';
import { getSession } from 'next-auth/react';

export const addNewDeals = async (deals: DealFormValues[]) => {
    const payload = deals.map(({ id, ...rest }) => rest);

    try {
        const data = await fetcherWithAuth(`/api/admin/deal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return data;
    } catch (error) {}
};

export const deleteDeal = async (id: string) => {
    try {
        const session = await getSession();

        const res = await fetch(`/api/admin/deal/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error in deleting deal (service) =>', error);
    }
};

export const updateDeal = async (id: string, formData: any) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deal/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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

        if (!data.success) {
            throw new Error(data?.message || 'Failed to fetch top viewed deals');
        }

        return data.isDuplicate;
    } catch (error) {
        return false;
    }
};
