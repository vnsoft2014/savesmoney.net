import { MESSAGES } from '@/config/messages';
import { ADMIN_ROLES } from '@/config/user';
import connectDB from '@/lib/db/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: Request, { params }: Props) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json(
                { success: false, message: MESSAGES.ERROR.FORBIDDEN },
                { status: 403 },
            );
        }

        const { id } = await params;

        const deal = await Deal.findByIdAndUpdate(
            id,
            { updatedAt: new Date() },
            { new: true, timestamps: false },
        );

        if (!deal) {
            return NextResponse.json(
                { success: false, message: MESSAGES.ERROR.NOT_FOUND },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Updated time refreshed',
            data: { updatedAt: deal.updatedAt },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: MESSAGES.ERROR.INTERNAL_SERVER },
            { status: 500 },
        );
    }
}
