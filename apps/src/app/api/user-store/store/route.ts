import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { uploadImage } from '@/lib/upload';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { UserStore } from '@/models/UserStore';
import { generateUniqueSlug, sanitizeDescription, sanitizeUrl, stripHtml } from '@/utils/sanitize';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const CreateStoreSchema = Joi.object({
    name: Joi.string().trim().min(3).max(60).required().messages({
        'string.empty': 'Store name is required',
        'string.min': 'Store name must be at least 3 characters',
        'string.max': 'Store name must be less than 60 characters',
    }),

    website: Joi.string()
        .trim()
        .max(50)
        .allow('', null)
        .optional()
        .custom((value, helpers) => {
            if (!value) return value;

            try {
                const testVal = value.startsWith('http') ? value : `https://${value}`;
                new URL(testVal);
                return value;
            } catch {
                return helpers.error('any.invalid');
            }
        })
        .messages({
            'any.invalid': 'Invalid website URL',
            'string.max': 'Website URL must be less than 255 characters',
        }),

    description: Joi.string().min(10).max(300).required().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description must be less than 300 characters',
    }),

    logo: Joi.any()
        .required()
        .custom((value, helpers) => {
            if (!(value instanceof File) || value.size === 0) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.required': 'Logo is required',
            'any.invalid': 'Logo is required',
        }),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);

        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const formData = await req.formData();

        const body = {
            name: formData.get('name'),
            website: formData.get('website'),
            description: formData.get('description'),
            logo: formData.get('logo'),
        };

        const { error, value } = CreateStoreSchema.validate(body, { abortEarly: false });
        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        let { name, website, description, logo } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const existingStore = await UserStore.findOne({ author });

        if (existingStore) {
            return NextResponse.json({ success: false, message: 'Store already exists' }, { status: 400 });
        }

        name = stripHtml(name);
        description = sanitizeDescription(description);
        website = sanitizeUrl(website);

        const slug = generateUniqueSlug(name);

        const store = new UserStore({
            name,
            slug,
            website,
            description,
            author,
        });

        if (logo instanceof File && logo.size > 0) {
            try {
                const result = await uploadImage(logo, {
                    width: 300,
                    height: 300,
                    folder: 'uploads/user-stores',
                    type: 'thumbnail',
                    uploadedBy: author,
                    slug,
                });

                store.logo = result.url;
            } catch (err: any) {
                if (err.message === 'INVALID_IMAGE_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid logo type' }, { status: 400 });
                }

                if (err.message === 'IMAGE_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Logo size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload logo failed' }, { status: 500 });
            }
        }

        await store.save();

        return NextResponse.json({
            success: true,
            store,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}

export const UpdateStoreSchema = Joi.object({
    name: Joi.string().trim().min(3).max(60).required().messages({
        'string.empty': 'Store name is required',
        'string.min': 'Store name must be at least 3 characters',
        'string.max': 'Store name must be less than 60 characters',
    }),

    website: Joi.string()
        .trim()
        .max(255)
        .allow('', null)
        .optional()
        .custom((value, helpers) => {
            if (!value) return value;

            try {
                const testVal = value.startsWith('http') ? value : `https://${value}`;
                new URL(testVal);
                return value;
            } catch {
                return helpers.error('any.invalid');
            }
        })
        .messages({
            'any.invalid': 'Invalid website URL',
        }),

    description: Joi.string().min(10).max(300).required().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description must be less than 300 characters',
    }),

    logo: Joi.any()
        .optional()
        .custom((value, helpers) => {
            if (!(value instanceof File) || value.size === 0) {
                return helpers.error('any.invalid');
            }
            return value;
        }),
});

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);

        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const formData = await req.formData();

        const body = {
            name: formData.get('name'),
            website: formData.get('website'),
            description: formData.get('description'),
            logo: formData.get('logo'),
        };

        const { error, value } = UpdateStoreSchema.validate(body, { abortEarly: false });

        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        let { name, website, description, logo } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const store = await UserStore.findOne({ author });

        if (!store) {
            return NextResponse.json({ message: 'Store not found' }, { status: 404 });
        }

        if (name) {
            name = stripHtml(name);
            store.name = name;
        }

        if (description !== null) {
            description = sanitizeDescription(description);
            store.description = description;
        }

        if (website !== null) {
            website = sanitizeUrl(website);
            store.website = website;
        }

        if (logo instanceof File && logo.size > 0) {
            try {
                const result = await uploadImage(logo, {
                    width: 300,
                    height: 300,
                    folder: 'uploads/user-stores',
                    type: 'thumbnail',
                    uploadedBy: author,
                    slug: store.slug,
                });

                store.logo = result.url;
            } catch (err: any) {
                if (err.message === 'INVALID_IMAGE_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid logo type' }, { status: 400 });
                }

                if (err.message === 'IMAGE_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Logo size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload logo failed' }, { status: 500 });
            }
        }

        await store.save();

        return NextResponse.json({ success: true, message: 'Store updated successfully', data: store });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);

        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const userStore = await UserStore.findOne({ author }).select('_id').lean();

        if (!userStore) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 400 },
            );
        }

        const store = await UserStore.findById(userStore._id);

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'UserStore not found',
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: store,
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
}
