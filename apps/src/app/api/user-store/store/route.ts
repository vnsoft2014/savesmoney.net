import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { UserStore } from '@/models/UserStore';
import { uploadImage } from '@/utils/Upload';
import { randomUUID } from 'crypto';
import fs from 'fs';
import Joi from 'joi';
import { NextResponse } from 'next/server';
import path from 'path';
import slugify from 'slugify';

export const CreateStoreSchema = Joi.object({
    name: Joi.string().trim().min(3).max(60).required().messages({
        'string.empty': 'Store name is required',
        'string.min': 'Store name must be at least 3 characters',
        'string.max': 'Store name must be less than 60 characters',
    }),

    website: Joi.string()
        .trim()
        .max(255)
        .allow('')
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
            console.log(error);
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const { name, website, description, logo } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const existingStore = await UserStore.findOne({ author });

        if (existingStore) {
            return NextResponse.json({ success: false, message: 'Store already exists' }, { status: 400 });
        }

        const slug = slugify(name, { lower: true, strict: true });

        let logoUrl = '';

        if (logo instanceof File && logo.size > 0) {
            try {
                logoUrl = await uploadImage({
                    file: logo,
                    fileName: `user-store-${slug}-${randomUUID()}`,
                    uploadFolder: 'uploads/user-stores',
                    errorPrefix: 'STORE_LOGO',
                });
            } catch (err: any) {
                if (err.message === 'INVALID_STORE_LOGO_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid logo type' }, { status: 400 });
                }

                if (err.message === 'STORE_LOGO_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload logo failed' }, { status: 500 });
            }
        }

        const store = await UserStore.create({
            name,
            slug,
            website,
            description,
            logo: logoUrl,
            author,
        });

        return NextResponse.json({
            success: true,
            store,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
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
        .allow('')
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

    logo: Joi.any().optional(),
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
        console.log(error);

        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const { name, website, description, logo } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const store = await UserStore.findOne({ author });

        if (!store) {
            return NextResponse.json({ message: 'Store not found' }, { status: 404 });
        }

        if (name) {
            store.name = name;
        }

        if (description !== null) store.description = description;
        if (website !== null) store.website = website;

        if (logo instanceof File && logo.size > 0) {
            try {
                const oldLogo = store.logo;

                const newLogoUrl = await uploadImage({
                    file: logo,
                    fileName: `user-store-${store.slug}-${randomUUID()}`,
                    uploadFolder: 'uploads/user-stores',
                    errorPrefix: 'STORE_LOGO',
                });

                store.logo = newLogoUrl;

                if (oldLogo) {
                    const oldPath = path.join(process.cwd(), 'public', oldLogo);

                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
            } catch (err: any) {
                if (err.message === 'INVALID_STORE_LOGO_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid logo type' }, { status: 400 });
                }

                if (err.message === 'STORE_LOGO_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 0.5MB' },
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
