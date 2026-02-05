import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import DealSubscriber from '@/models/Subscriber';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const checkSubscriberSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Email is invalid',
            'any.required': 'Email is required',
        }),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { error, value } = checkSubscriberSchema.validate(body);

        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }

        const subscriber = await DealSubscriber.findOne({ email: value.email }).lean();

        return NextResponse.json({
            subscribed: !!subscriber,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
