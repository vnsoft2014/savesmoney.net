import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import DealAlert from '@/models/DealAlert';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DealAlertCreateSchema = Joi.object({
    keywords: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
    channel: Joi.string().valid('email').required(),
    name: Joi.string().trim().min(1).max(100).required(),
    email: Joi.string().email().required(),
    user: Joi.string().allow(null).optional(),
    isActive: Joi.boolean().optional(),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const { error, value } = DealAlertCreateSchema.validate(body, {
            abortEarly: false,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.VALIDATION,
                },
                { status: 400 },
            );
        }

        const dealAlert = await DealAlert.create({
            user: value.user,
            keywords: value.keywords,
            channel: value.channel,
            name: value.name,
            email: value.email,
            isActive: value.isActive ?? true,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Deal alert created successfully!',
            },
            { status: 201 },
        );
    } catch (err: any) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
