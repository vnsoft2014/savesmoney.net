import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Subscriber from '@/models/Subscriber';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const subscribeSubscriberSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
    }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Email is invalid',
            'any.required': 'Email is required',
        }),

    userId: Joi.string().optional().allow(null),

    isRegisteredUser: Joi.boolean().optional(),

    source: Joi.string().valid('popup', 'subscribe-box').optional(),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { error, value } = subscribeSubscriberSchema.validate(body);

        if (error) {
            return NextResponse.json({ subscribed: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const existed = await Subscriber.findOne({ email: value.email });
        if (existed) {
            return NextResponse.json({
                message: 'Email already subscribed',
                subscribed: false,
            });
        }

        await Subscriber.create({
            name: value.name,
            email: value.email,
            userId: value.userId ?? null,
            isRegisteredUser: !!value.isRegisteredUser,
            source: value.source ?? 'popup',
        });

        return NextResponse.json({
            message: 'Subscribed successfully',
            subscribed: true,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
