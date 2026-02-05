import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import Validation from '@/models/validation';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const BodySchema = Joi.object({
    invalid: Joi.boolean().required(),
});

export async function POST(req: Request, { params }: Props) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const { id } = await params;

        const body = await req.json();
        const { error, value } = BodySchema.validate(body);

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.VALIDATION,
                },
                { status: 400 },
            );
        }

        const { invalid } = value;

        const deal = await Deal.findByIdAndUpdate(id, { invalid }, { new: true });

        if (!deal) {
            return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
        }

        await Validation.findOneAndUpdate(
            { deal: id },
            {
                valid: 0,
                invalid: 0,
                marked: true,
            },
            { upsert: true },
        );

        return NextResponse.json({
            success: true,
            message: invalid ? 'Deal marked as invalid' : 'Deal marked as valid',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
