import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY, ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import Store from '@/models/Store';
import { uploadImage } from '@/utils/Upload';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

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

export const PATCH = withObjectId(async (req: Request, { params }: Props) => {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 403 });
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

        const { id } = await params;

        const store = await Store.findById(id);
        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 404 },
            );
        }

        const { name, slug, thumbnail } = value;

        // Check slug duplicate
        const slugExists = await Store.findOne({
            slug,
            _id: { $ne: id },
        });

        if (slugExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Slug already exists',
                },
                { status: 400 },
            );
        }

        store.name = name;
        store.slug = slug;

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
                        { success: false, message: 'Thumbnail size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload thumbnail failed' }, { status: 500 });
            }
        }

        await store.save();

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.UPDATED,
            data: store,
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
});

export const DELETE = withObjectId(async (req: Request, { params }: Props) => {
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

        const store = await Store.findById(id);

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Store not found',
                },
                { status: 404 },
            );
        }

        await Store.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Store deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
                error,
            },
            { status: 500 },
        );
    }
});
