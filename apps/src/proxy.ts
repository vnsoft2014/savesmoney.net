import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const ROLE_ACCESS: Record<string, string[]> = {
    '/dashboard/user': ['admin'],
    '/dashboard': ['admin', 'contributor'],
    '/my-store': ['admin', 'contributor', 'user'],
};

const AUTH_PAGES = ['/signin', '/signup', '/forgot-password', '/reset-password'];

export async function proxy(req: NextRequest) {
    const { pathname } = new URL(req.url);

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthPage = AUTH_PAGES.some((path) => pathname.startsWith(path));

    if (
        token &&
        (token.error === 'AccessTokenExpired' || (token.accessTokenExpires && Date.now() > token.accessTokenExpires))
    ) {
        const res = NextResponse.redirect(new URL('/signin', req.url));
        res.cookies.delete('next-auth.session-token');
        res.cookies.delete('__Secure-next-auth.session-token');
        return res;
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!isAuthPage && !token) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    if (token) {
        const role = typeof token.role === 'string' ? token.role : null;

        if (!role) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }

        for (const path in ROLE_ACCESS) {
            if (pathname.startsWith(path)) {
                if (!ROLE_ACCESS[path].includes(role)) {
                    return NextResponse.redirect(new URL('/', req.url));
                }
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/dashboard/:path*',
        '/user/:path*',
        '/api/admin/:path*',
    ],
};
