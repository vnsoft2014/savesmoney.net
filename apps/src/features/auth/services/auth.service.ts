import { fetcher } from '@/utils/utils';

export const registerMe = async (formData: any) => {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return data;
    } catch (error) {
        return {
            success: false,
            message: '000000',
        };
    }
};
