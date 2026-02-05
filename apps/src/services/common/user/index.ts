import { fetcher, fetcherWithAuth } from '@/utils/utils';

export const updateProfile = async (formData: any) => {
    const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/user/profile`, {
        method: 'PATCH',
        body: formData,
    });

    return data;
};

export const forgotPassword = async (email: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    return data;
};

export const resetPassword = async (token: string, password: string) => {
    const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
    });

    return data;
};
