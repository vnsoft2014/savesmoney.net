import { getErrorMessage } from '@/utils/errorHandler';
import { SITE } from '@/utils/site';
import { fetcher, fetcherWithAuth } from '@/utils/utils';

export const updateSettings = async (formData: FormData) => {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/settings`, {
            method: 'POST',
            body: formData,
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
};

export const getSettings = async () => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/settings`, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!data.success) {
            throw new Error(data.message!);
        }

        return data.data;
    } catch (error: unknown) {
        return {
            websiteTitle: SITE.title,
            websiteDescription: SITE.description,
            logo: '',
            favicon: '',
            holidayDealsLabel: 'Holiday Deals',
            seasonalDealsLabel: 'Seasonal Deals',
            adminEmail: '',
            socialLinks: {
                facebookPage: '',
                facebookGroup: '',
                x: '',
                instagram: '',
                linkedin: '',
            },
        };
    }
};
