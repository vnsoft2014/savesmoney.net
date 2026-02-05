import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import User from '@/models/User';
import { uploadImage } from '@/utils/Upload';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
    }),

    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),

    password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, 'uppercase letter')
        .pattern(/[a-z]/, 'lowercase letter')
        .pattern(/[0-9]/, 'number')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.name': 'Password must contain at least one {#name}',
            'string.empty': 'Password is required',
        }),

    role: Joi.string().valid('user', 'admin', 'contributor').default('user'),

    avatar: Joi.any().optional(),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 403 });
        }

        const formData = await req.formData();

        const body = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role') || 'user',
            avatar: formData.get('avatar'),
        };

        const { error, value } = createUserSchema.validate(body, {
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

        const { name, email, password, role: userRole, avatar } = value;

        const existed = await User.findOne({ email });
        if (existed) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            passwordString: userRole === 'contributor' ? password : undefined,
        });

        if (avatar instanceof File && avatar.size > 0) {
            try {
                user.avatar = await uploadImage({
                    file: avatar,
                    fileName: `avatar-${user._id.toString()}`,
                    uploadFolder: 'uploads/avatars',
                    errorPrefix: 'AVATAR',
                });
            } catch (err: any) {
                if (err.message === 'INVALID_AVATAR_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid avatar type' }, { status: 400 });
                }

                if (err.message === 'AVATAR_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Avatar size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload avatar failed' }, { status: 500 });
            }
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.CREATED,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
