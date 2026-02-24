import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { uploadImage } from '@/lib/upload';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import DealType from '@/models/DealType';
import { stripHtml } from '@/utils/sanitize';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const dealTypeAddSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    slug: Joi.string()
        .min(3)
        .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .required()
        .messages({
            'string.pattern.base': 'Slug must be lowercase letters, numbers, and hyphens only',
        }),
    thumbnail: Joi.any()
        .required()
        .custom((value, helpers) => {
            if (!(value instanceof File) || value.size === 0) {
                return helpers.error('any.invalid');
            }
            return value;
        }),
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

        const { error, value } = dealTypeAddSchema.validate(body, { abortEarly: false });
        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        let { name, slug, thumbnail } = value;

        name = stripHtml(name);

        const dealType = new DealType({
            name,
            slug,
        });

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
            message: MESSAGES.SUCCESS.CREATED,
            data: dealType,
        });
    } catch (err: any) {
        console.log(err);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
};
