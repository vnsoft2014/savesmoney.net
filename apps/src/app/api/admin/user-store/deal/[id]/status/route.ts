import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import { validateRequest } from '@/utils/validators/validate';
import Joi from 'joi';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const StatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'published', 'rejected').required(),
});

export async function PATCH(req: NextRequest, { params }: Props) {
    const { isValid, value: body, response } = await validateRequest(req, StatusSchema);
    if (!isValid) return response;

    try {
        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json({
                success: false,
                message: MESSAGES.ERROR.FORBIDDEN,
            });
        }

        await connectDB();

        const { id } = await params;

        const { status } = body;

        const deal = await Deal.findById(id);

        if (!deal) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 404 });
        }

        deal.status = status;
        await deal.save();

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.UPDATED,
            data: {
                _id: deal._id,
                status: deal.status,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
