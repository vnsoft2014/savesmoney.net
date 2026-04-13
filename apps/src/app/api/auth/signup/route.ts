import { MESSAGES } from '@/config/messages';
import connectDB from '@/lib/db/connectDB';
import { getWelcomeEmailHtml } from '@/lib/email-templates/welcome';
import { sendMail } from '@/lib/sendMail';
import { validateRequest } from '@/lib/validators/validate';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const SignUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
});

export async function POST(req: Request) {
    const { isValid, value: validateBody, response } = await validateRequest(req, SignUpSchema);
    if (!isValid) return response;

    await connectDB();

    const { email, password, name } = validateBody;

    try {
        const ifExist = await User.findOne({ email });

        if (ifExist) {
            return NextResponse.json({ success: false, message: MESSAGES.AUTH.USER_ALREADY_EXIST }, { status: 400 });
        } else {
            const hashedPassword = await hash(password, 10);
            const user = await User.create({ email, name, password: hashedPassword, role: 'user' });

            if (user) {
                const safeUser = await User.findById(user._id)
                    .select('-password -passwordString -resetPasswordToken -resetPasswordExpire')
                    .lean();

                // Send welcome email (fire-and-forget, don't block response)
                await sendMail({
                    to: email,
                    subject: 'Welcome to SavesMoney.Net — Start Saving Today!',
                    html: getWelcomeEmailHtml({ name, email }),
                });

                return NextResponse.json({
                    success: true,
                    message: MESSAGES.AUTH.ACCOUNT_CREATED,
                    data: safeUser,
                });
            }
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
