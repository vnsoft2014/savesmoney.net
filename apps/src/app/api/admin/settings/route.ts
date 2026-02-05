import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Settings from '@/models/Settings';
import { uploadImage } from '@/utils/Upload';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const SettingsSchema = Joi.object({
    websiteTitle: Joi.string().trim().min(2).max(160).required().messages({
        'string.empty': 'Website Title is required',
        'string.min': 'Website Title must be at least 2 characters',
        'string.max': 'Website Title must be at most 160 characters',
    }),

    websiteDescription: Joi.string().trim().min(2).max(300).required().messages({
        'string.empty': 'Website Description is required',
        'string.min': 'Website Description must be at least 2 characters',
        'string.max': 'Website Description must be at most 300 characters',
    }),

    logo: Joi.any().optional(),
    favicon: Joi.any().optional(),

    holidayDealsLabel: Joi.string().trim().min(2).max(50).optional(),
    seasonalDealsLabel: Joi.string().trim().min(2).max(50).optional(),

    adminEmail: Joi.string().email().lowercase().optional().allow(''),

    socialLinks: Joi.object({
        facebookPage: Joi.string().uri().allow('').optional(),
        facebookGroup: Joi.string().uri().allow('').optional(),
        x: Joi.string().uri().allow('').optional(),
        instagram: Joi.string().uri().allow('').optional(),
        linkedin: Joi.string().uri().allow('').optional(),
    }).optional(),
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ['admin'])) {
            return NextResponse.json({
                success: false,
                message: MESSAGES.ERROR.UNAUTHORIZED,
            });
        }

        const formData = await req.formData();

        const body = {
            websiteTitle: formData.get('websiteTitle')?.toString().trim(),
            websiteDescription: formData.get('websiteDescription')?.toString().trim(),
            logo: formData.get('logo') instanceof File ? formData.get('logo') : undefined,
            favicon: formData.get('favicon') instanceof File ? formData.get('favicon') : undefined,
            holidayDealsLabel: formData.get('holidayDealsLabel')?.toString().trim(),
            seasonalDealsLabel: formData.get('seasonalDealsLabel')?.toString().trim(),
            adminEmail: formData.get('adminEmail')?.toString().trim(),
            socialLinks: {
                facebookPage: (formData.get('socialLinks[facebookPage]') as string | null)?.trim() || '',
                facebookGroup: (formData.get('socialLinks[facebookGroup]') as string | null)?.trim() || '',
                x: (formData.get('socialLinks[x]') as string | null)?.trim() || '',
                instagram: (formData.get('socialLinks[instagram]') as string | null)?.trim() || '',
                linkedin: (formData.get('socialLinks[linkedin]') as string | null)?.trim() || '',
            },
        };

        const { error, value } = SettingsSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.VALIDATION,
                },
                { status: 400 },
            );
        }

        const settings = (await Settings.findOne()) || new Settings();

        const {
            websiteTitle,
            websiteDescription,
            logo,
            favicon,
            holidayDealsLabel,
            seasonalDealsLabel,
            adminEmail,
            socialLinks,
        } = value;

        settings.websiteTitle = websiteTitle;
        settings.websiteDescription = websiteDescription;
        settings.holidayDealsLabel = holidayDealsLabel;
        settings.seasonalDealsLabel = seasonalDealsLabel;
        settings.adminEmail = adminEmail;
        settings.socialLinks = socialLinks;

        if (logo instanceof File && logo.size > 0) {
            try {
                settings.logo = await uploadImage({
                    file: logo,
                    fileName: 'logo',
                    uploadFolder: 'uploads/images',
                    errorPrefix: 'LOGO',
                });
            } catch (err: any) {
                if (err.message === 'INVALID_LOGO_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid logo type' }, { status: 400 });
                }

                if (err.message === 'LOGO_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Logo size must be less than 0.5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload logo failed' }, { status: 500 });
            }
        }

        if (favicon instanceof File && favicon.size > 0) {
            try {
                settings.favicon = await uploadImage({
                    file: favicon,
                    fileName: 'favicon',
                    uploadFolder: 'uploads/images',
                    errorPrefix: 'FAVICON',
                });
            } catch (err: any) {
                return NextResponse.json({ success: false, message: 'Upload favicon failed' }, { status: 500 });
            }
        }

        await settings.save();

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.UPDATED,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
