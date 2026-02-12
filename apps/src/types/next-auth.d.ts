import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        error?: 'AccessTokenExpired';
        user: {
            _id: string;
            role: string;
            avatar: string;
        } & DefaultSession['user'];
    }

    interface User {
        role: string;
        avatar: string;
        accessToken: string;
        accessTokenExpires: number;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        avatar: string;
        accessToken: string | null;
        accessTokenExpires: number;
        error?: 'AccessTokenExpired';
    }
}
