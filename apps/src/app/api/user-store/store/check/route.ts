import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { UserStore } from '@/models/UserStore';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);

        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const exists = await UserStore.exists({
            author,
            isActive: true,
        });

        return NextResponse.json({
            success: true,
            exists: !!exists,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
