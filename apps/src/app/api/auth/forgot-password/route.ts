import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import User from '@/models/User';
import { sendMail } from '@/utils/sendMail';
import crypto from 'crypto';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required',
        }),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const { error, value } = forgotPasswordSchema.validate(body, {
            abortEarly: false,
        });

        if (error) {
            const messages = error.details.map((d) => d.message);
            return NextResponse.json({ success: false, message: messages.join(', ') }, { status: 400 });
        }

        const { email } = value;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'If that email exists, a reset link has been sent.',
                },
                { status: 400 },
            );
        }

        if (user.isBlocked) {
            return NextResponse.json({ success: false, message: 'Your account has been blocked.' }, { status: 403 });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`;

        await sendMail({
            to: user.email,
            subject: 'Reset your password',
            html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <p>
          <a href="${resetUrl}" target="_blank">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
      `,
        });

        return NextResponse.json({
            success: true,
            message: 'Password reset link has been sent to your email.',
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
