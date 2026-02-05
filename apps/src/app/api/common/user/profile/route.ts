import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import User from '@/models/User';
import { uploadImage } from '@/utils/Upload';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    avatar: Joi.any().optional(),
});

export async function PATCH(req: Request) {
    try {
        const role = await authCheck(req);
        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED }, { status: 403 });
        }

        const formData = await req.formData();
        const name = formData.get('name');
        const avatar = formData.get('avatar') as File;

        const { error, value } = updateProfileSchema.validate({ name }, { abortEarly: false });

        if (error) {
            const messages = error.details.map((d) => d.message);
            return NextResponse.json({ success: false, message: messages.join(', ') }, { status: 400 });
        }

        await connectDB();

        const authenticated = await authUser(req);

        console.log(authenticated);

        const user = await User.findById(authenticated?.sub);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (user.isBlocked) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Your account has been blocked',
                },
                { status: 403 },
            );
        }

        user.name = value.name;

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
            message: 'Profile updated successfully',
            finalData: {
                name: user.name,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
