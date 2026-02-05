import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
});

export async function POST(req: Request) {
    await connectDB();

    const { email, password, name } = await req.json();
    const { error } = schema.validate({ email, password, name });

    if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const ifExist = await User.findOne({ email });

        if (ifExist) {
            return NextResponse.json({ success: false, message: 'User Already Exist.' }, { status: 400 });
        } else {
            const hashedPassword = await hash(password, 10);
            const user = await User.create({ email, name, password: hashedPassword, role: 'user' });

            if (user) {
                const token = jwt.sign(
                    {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                    },
                    process.env.JWT_SECREAT ?? 'default_secret_dumbScret',
                    { expiresIn: '1d' },
                );

                const safeUser = await User.findById(user._id)
                    .select('-password -passwordString -resetPasswordToken -resetPasswordExpire')
                    .lean();

                return NextResponse.json({
                    success: true,
                    message: 'Account created successfully.',
                    data: {
                        token,
                        user: safeUser,
                    },
                });
            }
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
