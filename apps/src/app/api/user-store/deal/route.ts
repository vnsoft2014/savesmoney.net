import { MESSAGES } from '@/config/messages';
import { USER_ROLES } from '@/config/user';
import connectDB from '@/lib/db/connectDB';
import { generateUniqueSlug, sanitizeDescription, sanitizeUrl, stripHtml } from '@/lib/sanitize';
import { uploadDealImage } from '@/lib/upload';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const addDealSchema = Joi.object({
    picture: Joi.any()
        .required()
        .custom((value, helpers) => {
            if (!(value instanceof File) || value.size === 0) {
                return helpers.error('any.invalid');
            }
            return value;
        }),
    dealType: Joi.array().items(Joi.string()).min(1).required(),
    store: Joi.string().required(),
    expiredDate: Joi.string()
        .allow('')
        .custom((value, helpers) => {
            const { disableExpireAt, coupon, clearance } = helpers.state.ancestors[0];

            const mustDisable = coupon === true || clearance === true || disableExpireAt === true;

            if (mustDisable) {
                if (value) {
                    return helpers.error('any.invalid', {
                        message: 'Expired date must be null when disableExpireAt is true',
                    });
                }
                return null;
            }

            if (!value) {
                return helpers.error('any.required', {
                    message: 'Expired date is required',
                });
            }

            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return helpers.error('date.base', {
                    message: 'Expired date must be a valid date',
                });
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            date.setHours(0, 0, 0, 0);

            if (date < today) {
                return helpers.error('date.min', {
                    message: 'Expired date cannot be in the past',
                });
            }

            return value;
        }),
    shortDescription: Joi.string().required(),

    originalPrice: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).default(0),
    percentageOff: Joi.string().allow('').optional(),

    purchaseLink: Joi.string().uri().required(),
    description: Joi.string().required(),
    flashDeal: Joi.boolean().default(false),
    flashDealExpireHours: Joi.number().default(0),

    tags: Joi.array().items(Joi.string().trim().min(1)).default([]),

    hotTrend: Joi.boolean().default(false),
    holidayDeals: Joi.boolean().default(false),
    seasonalDeals: Joi.boolean().default(false),

    coupon: Joi.boolean().default(false),
    coupons: Joi.array()
        .items(
            Joi.object({
                code: Joi.string().trim().min(1).required(),
                comment: Joi.string().trim().min(1).required(),
            }),
        )
        .optional()
        .default([]),

    clearance: Joi.boolean().default(false),
    disableExpireAt: Joi.boolean().default(false),
}).custom((value, helpers) => {
    if (value.dealDiscountPrice >= value.dealOriginalPrice) {
        return helpers.error('any.invalid', {
            message: 'Discount Price must be less than Original Price',
        });
    }

    if (value.flashDeal === true) {
        if (!value.flashDealExpireHours || value.flashDealExpireHours <= 0) {
            return helpers.error('any.custom', {
                message: 'Expiration hours is required for flash deal',
                path: ['flashDealExpireHours'],
            });
        }
    }

    return value;
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

        const rawCoupons = formData.getAll('coupons');

        const parsedCoupons = rawCoupons.map((c) => {
            if (typeof c === 'string') {
                return JSON.parse(c);
            }
            return c;
        });

        const body = {
            picture: formData.get('picture'),
            dealType: formData.getAll('dealType'),
            store: formData.get('store'),
            expiredDate: formData.get('expiredDate'),

            shortDescription: formData.get('shortDescription'),

            originalPrice: formData.get('originalPrice'),
            discountPrice: formData.get('discountPrice'),
            percentageOff: formData.get('percentageOff'),

            purchaseLink: formData.get('purchaseLink'),
            description: formData.get('description'),

            flashDeal: formData.get('flashDeal'),
            flashDealExpireHours: formData.get('flashDealExpireHours'),

            tags: formData.getAll('tags'),

            hotTrend: formData.get('hotTrend'),
            holidayDeals: formData.get('holidayDeals'),
            seasonalDeals: formData.get('seasonalDeals'),

            coupon: formData.get('coupon'),
            coupons: parsedCoupons,

            clearance: formData.get('clearance'),
            disableExpireAt: formData.get('disableExpireAt'),
        };

        const { error, value } = addDealSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const {
            picture,
            dealType,
            store,
            expiredDate,
            shortDescription,
            originalPrice,
            discountPrice,
            percentageOff,
            purchaseLink,
            description,
            flashDeal,
            flashDealExpireHours,
            tags,
            hotTrend,
            holidayDeals,
            seasonalDeals,
            coupon,
            coupons,
            clearance,
            disableExpireAt,
        } = value;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const [existingDeal, userStore] = await Promise.all([
            Deal.findOne({
                author: author,
                $or: [{ purchaseLink: purchaseLink }, { shortDescription: shortDescription }],
            }).select('purchaseLink shortDescription'),
            UserStore.findOne({ author }).select('_id isActive').lean(),
        ]);

        if (!userStore) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 400 },
            );
        }

        if (!userStore.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Your store is currently inactive. Please contact admin.',
                },
                { status: 403 },
            );
        }

        if (existingDeal) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Duplicate deal exists',
                    duplicates: {
                        purchaseLink: existingDeal.purchaseLink === purchaseLink ? purchaseLink : null,
                        shortDescription: existingDeal.shortDescription === shortDescription ? shortDescription : null,
                    },
                },
                { status: 409 },
            );
        }

        let expireAt: Date | null = null;

        if (flashDeal) {
            expireAt = new Date(Date.now() + flashDealExpireHours! * 60 * 60 * 1000);
        } else {
            const finalDisableExpireAt = coupon === true || clearance === true ? true : Boolean(disableExpireAt);

            if (!finalDisableExpireAt && expiredDate) {
                expireAt = new Date(expiredDate + 'T23:59:59.000Z');
            }
        }

        let userStoreId = null;

        if (userStore) {
            userStoreId = userStore._id;
        }

        const slug = generateUniqueSlug(shortDescription);

        const newDeal = new Deal({
            dealType: dealType,
            store: store,
            expireAt,

            shortDescription: stripHtml(shortDescription),
            slug,
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            percentageOff: stripHtml(percentageOff),
            purchaseLink: sanitizeUrl(purchaseLink),
            description: sanitizeDescription(description),

            flashDeal: flashDeal,
            flashDealExpireHours: flashDealExpireHours || null,
            tags: stripHtml(tags),

            hotTrend: hotTrend,
            holidayDeals: holidayDeals,
            seasonalDeals: seasonalDeals,

            coupon: coupon,
            clearance: clearance,
            disableExpireAt: disableExpireAt,

            userStore: userStoreId,
            author,

            status: 'pending',
        });

        if (coupons !== undefined) {
            if (Array.isArray(coupons) && coupons.length > 0) {
                newDeal.coupons = coupons.map((c) => ({
                    code: stripHtml(c.code),
                    comment: stripHtml(c.comment),
                }));
            } else {
                newDeal.coupons = [];
            }
        }

        if (picture instanceof File && picture.size > 0) {
            try {
                const authenticated = await authUser(req);

                const author = authenticated!.sub;

                newDeal.image = await uploadDealImage(picture, {
                    resize: { width: 450, height: 450 },
                    uploadedBy: author!,
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : '';

                if (message === 'INVALID_IMAGE_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid thumbnail type' }, { status: 400 });
                }

                if (message === 'IMAGE_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload thumbnail failed' }, { status: 500 });
            }
        }

        await newDeal.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Deal created successfully',
                data: newDeal,
            },
            { status: 201 },
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
