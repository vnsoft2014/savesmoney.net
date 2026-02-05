import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Store from '@/models/Store';
import { uploadImage } from '@/utils/Upload';
import Joi from 'joi';
import { NextRequest, NextResponse } from 'next/server';

const storeSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string()
        .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .required()
        .messages({
            'string.pattern.base': 'Slug must be lowercase letters, numbers, and hyphens only',
        }),
    thumbnail: Joi.any().optional(),
});

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 401 });
        }

        const formData = await req.formData();

        const body = {
            name: formData.get('name'),
            slug: formData.get('slug'),
            thumbnail: formData.get('thumbnail'),
        };

        const { error, value } = storeSchema.validate(body, { abortEarly: false });
        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const { name, slug, thumbnail } = value;

        const store = new Store({
            name,
            slug,
        });

        if (thumbnail instanceof File && thumbnail.size > 0) {
            try {
                store.thumbnail = await uploadImage({
                    file: thumbnail,
                    fileName: `store-${slug}`,
                    uploadFolder: 'uploads/stores',
                    errorPrefix: 'STORE_THUMBNAIL',
                });
            } catch (err: any) {
                if (err.message === 'INVALID_STORE_THUMBNAIL_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid thumbnail type' }, { status: 400 });
                }

                if (err.message === 'STORE_THUMBNAIL_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 1MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload thumbnail failed' }, { status: 500 });
            }
        }

        await store.save();

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.CREATED,
            data: store,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
};
