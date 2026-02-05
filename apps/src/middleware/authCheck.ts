import { UserRole } from '@/types';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export const authCheck = async (req: Request) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return false;
    }
    try {
        const decoded = (await jwt.verify(token, process.env.NEXTAUTH_SECRET!)) as JwtPayload;

        if (decoded) return decoded?.role;
    } catch {
        return false;
    }
};

export const authUser = async (req: Request) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return {};
    }
    try {
        const decoded = (await jwt.verify(token, process.env.NEXTAUTH_SECRET!)) as JwtPayload;

        if (decoded) return decoded;
    } catch {
        return {};
    }
};

export function assertRole<T extends readonly UserRole[]>(
    role: UserRole | null | undefined,
    userRoles: T,
): role is T[number] {
    if (!role) return false;

    return userRoles.includes(role);
}
