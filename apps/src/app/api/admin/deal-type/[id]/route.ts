import { MESSAGES } from '@/config/messages';
import { ADMIN_ONLY, ADMIN_ROLES } from '@/config/user';
import connectDB from '@/lib/db/connectDB';
import { stripHtml } from '@/lib/sanitize';
import { uploadImage } from '@/lib/upload';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import DealType from '@/models/DealType';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const dealTypeUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    slug: Joi.string()
        .min(3)
        .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .required()
        .messages({
            'string.pattern.base': 'Slug must be lowercase letters, numbers, and hyphens only',
        }),
    thumbnail: Joi.any()
        .optional()
        .custom((value, helpers) => {
            if (!(value instanceof File) || value.size === 0) {
                return helpers.error('any.invalid');
            }
            return value;
        }),
});

export const PATCH = withObjectId(async (req: Request, { params }: Props) => {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 403 });
        }

        const { id } = await params;

        const dealType = await DealType.findById(id);
        if (!dealType) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 404 });
        }

        const formData = await req.formData();

        const body = {
            name: formData.get('name'),
            slug: formData.get('slug'),
            thumbnail: formData.get('thumbnail'),
        };

        const { error, value } = dealTypeUpdateSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        let { name, slug, thumbnail } = value;

        if (name) {
            name = stripHtml(name);
            dealType.name = name;
        }

        if (slug) {
            dealType.slug = slug;
        }

        if (thumbnail instanceof File && thumbnail.size > 0) {
            try {
                const authenticated = await authUser(req);

                const author = authenticated!.sub;

                const result = await uploadImage(thumbnail, {
                    width: 300,
                    height: 300,
                    folder: 'uploads/deal-types',
                    type: 'thumbnail',
                    uploadedBy: author,
                    slug,
                });

                dealType.thumbnail = result.url;
            } catch (err: any) {
                if (err.message === 'INVALID_IMAGE_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid thumbnail type' }, { status: 400 });
                }

                if (err.message === 'IMAGE_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload thumbnail failed' }, { status: 500 });
            }
        }

        await dealType.save();

        return NextResponse.json({
            success: true,
            message: 'Deal Type updated successfully',
            data: dealType,
        });
    } catch {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
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

        const dealType = await DealType.findById(id);

        if (!dealType) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 404 },
            );
        }

        await DealType.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.DELETED,
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
