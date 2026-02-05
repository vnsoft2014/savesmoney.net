import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import Subscriber from '@/models/Subscriber';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export const DELETE = withObjectId(async (req: Request, { params }: Props) => {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const { id } = await params;

        const dealType = await Subscriber.findById(id);

        if (!dealType) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 404 },
            );
        }

        await Subscriber.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.DELETED,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
});
