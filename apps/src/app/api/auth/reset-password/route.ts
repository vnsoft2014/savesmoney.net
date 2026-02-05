import { hash } from 'bcryptjs';
import crypto from 'crypto';
import Joi from 'joi';
import { NextResponse } from 'next/server';

import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import User from '@/models/User';

const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Reset token is required',
        'any.required': 'Reset token is required',
    }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number and special character',
            'any.required': 'Password is required',
        }),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const { error, value } = resetPasswordSchema.validate(body, {
            abortEarly: false,
        });

        if (error) {
            const messages = error.details.map((d) => d.message);
            return NextResponse.json({ success: false, message: messages.join(', ') }, { status: 400 });
        }
        const { token, password } = value;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Reset token is invalid or expired',
                },
                { status: 400 },
            );
        }

        user.password = await hash(password, 10);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully',
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
}
