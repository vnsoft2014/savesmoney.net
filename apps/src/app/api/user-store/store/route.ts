import { MESSAGES } from '@/config/messages';
import { USER_ROLES } from '@/config/user';
import connectDB from '@/lib/db/connectDB';
import { generateUniqueSlug, sanitizeDescription, sanitizeUrl, stripHtml } from '@/lib/sanitize';
import { sendMail } from '@/lib/sendMail';
import { uploadImage } from '@/lib/upload';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import Settings from '@/models/Settings';
import User from '@/models/User';
import { UserStore } from '@/models/UserStore';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const createStoreSchema = Joi.object({
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

        const { error, value } = createStoreSchema.validate(body, { abortEarly: false });
        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        let { name, website, description, logo } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const user = await User.findById(author);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

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

        let adminEmail: string | undefined;

        try {
            const settings = await Settings.findOne().select('adminEmail').lean();
            adminEmail = settings?.adminEmail;
        } catch (e) {
            console.error('Load adminEmail failed', e);
        }

        await sendMail({
            to: user.email,
            bcc: adminEmail || undefined,
            subject: 'Your store has been created successfully - SavesMoney.Net',
            html: `
            <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;margin:40px auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

                        <!-- Header -->
                        <tr>
                        <td style="background:#1c398e;padding:28px;text-align:center;color:white;">
                            <h1 style="margin:0;font-size:24px;">Store Created</h1>
                            <p style="margin-top:6px;font-size:14px;opacity:.9;">
                            Congratulations! Your store is now live.
                            </p>
                        </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                        <td style="padding:30px;">

                            <p style="font-size:16px;color:#333;margin-top:0;">
                            Hi there,
                            </p>

                            <p style="font-size:15px;color:#555;line-height:1.6;">
                            Your store has been successfully created on <strong>SAVESMONEY.NET</strong>. 
                            Below are your store details:
                            </p>

                            <!-- Info box -->
                            <div style="background:#f8fafc;border-radius:10px;padding:20px;margin:24px 0;">
                            <p style="margin:6px 0;font-size:15px;">
                                <strong>Store Name:</strong> ${store.name}
                            </p>
                            <p style="margin:6px 0;font-size:15px;">
                                <strong>Store Slug:</strong> ${store.slug}
                            </p>
                            </div>

                            <!-- Button -->
                            <div style="text-align:center;margin-top:30px;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/sm-stores/${store.slug}-${store._id}" 
                                style="background:#1c398e;color:white;padding:14px 26px;
                                        border-radius:8px;text-decoration:none;font-size:15px;
                                        font-weight:bold;display:inline-block;">
                                View Your Store
                            </a>
                            </div>

                            <p style="font-size:14px;color:#888;margin-top:30px;line-height:1.6;">
                            If you did not create this store, please contact support immediately.
                            </p>

                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td style="background:#f1f5f9;text-align:center;padding:18px;font-size:12px;color:#777;">
                            © ${new Date().getFullYear()} Your Platform. All rights reserved.
                        </td>
                        </tr>

                    </table>

                    </td>
                </tr>
                </table>
            </div>
            `,
        });

        return NextResponse.json({
            success: true,
            store,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}

export const updateStoreSchema = Joi.object({
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
            logo: formData.get('logo') || undefined,
        };

        const { error, value } = updateStoreSchema.validate(body, { abortEarly: false });

        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        let { name, website, description, logo } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const user = await User.findById(author);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

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
