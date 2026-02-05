'use client';

import { User } from '@/types';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const user = session?.user as User | undefined;

    const isLoading = status === 'loading';
    const isSignin = status === 'authenticated';
    const isAdmin = isSignin && user?.role !== 'user';

    useEffect(() => {
        if ((session as any)?.error === 'AccessTokenExpired') {
            signOut();
        }
    }, [session]);

    const login = () => {
        const redirect = pathname === '/' ? '/' : pathname;
        router.push(`/signin?callbackUrl=${encodeURIComponent(redirect)}`);
    };

    const logout = () => {
        signOut({ callbackUrl: '/signin' });
    };

    return {
        user,
        status,
        isLoading,
        isSignin,
        isAdmin,
        login,
        logout,
    };
}
