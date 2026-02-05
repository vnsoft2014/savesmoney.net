import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY, CONTRIBUTOR_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import User from '@/models/User';
import { uploadImage } from '@/utils/Upload';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const updateUserSchema = Joi.object({
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
        .optional()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.name': 'Password must contain at least one {#name}',
        }),

    role: Joi.string().valid('user', 'admin', 'contributor').required(),

    avatar: Joi.any().optional(),

    isBlocked: Joi.boolean().optional(),
    blockReason: Joi.string().allow('', null).optional(),
});

export async function PATCH(req: Request, { params }: Props) {
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
            password: formData.get('password') || undefined,
            role: formData.get('role'),
            isBlocked: formData.get('isBlocked') === 'true',
            blockReason: formData.get('blockReason'),
            avatar: formData.get('avatar'),
        };

        const { error, value } = updateUserSchema.validate(body, {
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

        const { name, email, password, role: userRole, avatar, isBlocked, blockReason } = value;

        if (isBlocked && (!blockReason || !blockReason.trim())) {
            return NextResponse.json(
                { success: false, message: 'Block reason is required when user is blocked' },
                { status: 400 },
            );
        }

        const { id } = await params;

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 404 });
        }

        const emailExists = await User.findOne({ email, _id: { $ne: id } });
        if (emailExists) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }

        user.name = name;
        user.email = email;
        user.role = userRole;

        const wasBlocked = user.isBlocked;

        user.isBlocked = !!isBlocked;

        if (user.isBlocked) {
            user.blockReason = blockReason;
            user.blockedAt = wasBlocked ? user.blockedAt : new Date();
        } else {
            user.blockReason = '';
            user.blockedAt = null;
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
            if (assertRole(userRole, CONTRIBUTOR_ONLY)) {
                user.passwordString = password;
            }
        }

        if (avatar instanceof File && avatar.size > 0) {
            try {
                user.avatar = await uploadImage({
                    file: avatar,
                    fileName: `${user._id}-${Date.now()}`,
                    oldImage: user.avatar,
                });
            } catch (err: any) {
                if (err.message === 'INVALID_AVATAR_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid avatar type' }, { status: 400 });
                }

                if (err.message === 'AVATAR_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Image size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload avatar failed' }, { status: 500 });
            }
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.UPDATED,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Props) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const { id } = await params;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 404 },
            );
        }

        const authenticated = await authUser(req);

        if (user._id.toString() === authenticated?.sub) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'You cannot delete your own account',
                },
                { status: 400 },
            );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.DELETED,
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
