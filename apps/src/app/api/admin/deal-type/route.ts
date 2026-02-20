import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import DealType from '@/models/DealType';
import { uploadImage } from '@/utils/Upload';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const dealTypeSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string()
        .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .required()
        .messages({
            'string.pattern.base': 'Slug must be lowercase letters, numbers, and hyphens only',
        }),
    thumbnail: Joi.any().optional(),
});

export const POST = async (req: Request) => {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ['admin', 'contributor'])) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 403 });
        }

        const formData = await req.formData();

        const body = {
            name: formData.get('name'),
            slug: formData.get('slug'),
            thumbnail: formData.get('thumbnail'),
        };

        const { error, value } = dealTypeSchema.validate(body, { abortEarly: false });
        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const { name, slug, thumbnail } = value;

        const dealType = new DealType({
            name,
            slug,
        });

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
            message: MESSAGES.SUCCESS.CREATED,
            data: dealType,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
};
