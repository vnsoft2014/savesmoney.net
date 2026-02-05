import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY, ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import DealType from '@/models/DealType';
import { uploadImage } from '@/utils/Upload';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const dealTypeUpdateSchema = Joi.object({
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

        const { name, slug, thumbnail } = value;

        const slugExists = await DealType.findOne({
            slug,
            _id: { $ne: id },
        });

        if (slugExists) {
            return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 400 });
        }

        dealType.name = name;
        dealType.slug = slug;

        if (thumbnail instanceof File && thumbnail.size > 0) {
            try {
                dealType.thumbnail = await uploadImage({
                    file: thumbnail,
                    fileName: `deal-type-${slug}`,
                    uploadFolder: 'uploads/deal-types',
                    errorPrefix: 'DEAL_TYPE_THUMBNAIL',
                });
            } catch (err: any) {
                if (err.message === 'INVALID_DEAL_TYPE_THUMBNAIL_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid thumbnail type' }, { status: 400 });
                }

                if (err.message === 'DEAL_TYPE_THUMBNAIL_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 1MB' },
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
