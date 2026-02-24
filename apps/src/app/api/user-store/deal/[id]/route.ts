import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY, USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import { sanitizeDescription, sanitizeUrl, stripHtml } from '@/utils/sanitize';
import { uploadDealImage } from '@/utils/upload';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const updateDealSchema = Joi.object({
    picture: Joi.any().optional(),

    dealType: Joi.array().items(Joi.string()).optional(),

    store: Joi.string().optional(),

    expiredDate: Joi.string()
        .optional()
        .allow(null, '')
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

    purchaseLink: Joi.string().uri().optional(),
    description: Joi.string().optional(),
    flashDeal: Joi.boolean().optional(),
    flashDealExpireHours: Joi.number().default(0),

    tags: Joi.array().items(Joi.string().trim().min(1)).allow(null).optional().default([]),

    hotTrend: Joi.boolean().allow(null).optional(),
    holidayDeals: Joi.boolean().optional(),
    seasonalDeals: Joi.boolean().optional(),

    coupon: Joi.boolean().default(false),
    coupons: Joi.array()
        .items(
            Joi.object({
                code: Joi.string().trim().min(1).required(),
                comment: Joi.string().trim().allow(null, '').optional(),
            }),
        )
        .optional()
        .default([]),

    clearance: Joi.boolean().default(false),
    disableExpireAt: Joi.boolean().allow(null).optional(),
})
    .min(2)
    .custom((value, helpers) => {
        if (
            typeof value.originalPrice === 'number' &&
            typeof value.discountPrice === 'number' &&
            value.discountPrice >= value.originalPrice
        ) {
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

export async function PATCH(req: Request, { params }: Props) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json({
                success: false,
                message: MESSAGES.ERROR.FORBIDDEN,
            });
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

        const { error, value } = updateDealSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            console.log(error);
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

        const { id: dealId } = await params;

        const duplicateQuery: any = {
            _id: { $ne: new mongoose.Types.ObjectId(dealId) },
            $or: [],
        };

        if (purchaseLink !== undefined) {
            duplicateQuery.$or.push({ purchaseLink });
        }

        if (shortDescription !== undefined) {
            duplicateQuery.$or.push({ shortDescription });
        }

        if (duplicateQuery.$or.length > 0) {
            const duplicateDeal = await Deal.findOne(duplicateQuery).select('purchaseLink shortDescription');

            if (duplicateDeal) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Duplicate data detected',
                        duplicateFields: {
                            purchaseLink: purchaseLink !== undefined && duplicateDeal.purchaseLink === purchaseLink,
                            shortDescription:
                                shortDescription !== undefined && duplicateDeal.shortDescription === shortDescription,
                        },
                    },
                    { status: 409 },
                );
            }
        }

        const updateData: any = {};

        if (dealType !== undefined) updateData.dealType = dealType;
        if (store !== undefined) updateData.store = store;

        if (flashDeal !== undefined) {
            updateData.flashDeal = flashDeal;
        }

        if (flashDeal) {
            const existingDeal = await Deal.findById(dealId).select('flashDealExpireHours');

            updateData.disableExpireAt = false;

            const hasExpireHoursChanged =
                flashDealExpireHours && flashDealExpireHours !== existingDeal?.flashDealExpireHours;

            if (hasExpireHoursChanged) {
                updateData.flashDealExpireHours = flashDealExpireHours;

                updateData.expireAt = new Date(Date.now() + flashDealExpireHours * 60 * 60 * 1000);
            }
        } else {
            updateData.flashDealExpireHours = null;

            const finalDisableExpireAt = coupon === true || clearance === true ? true : Boolean(disableExpireAt);

            updateData.disableExpireAt = finalDisableExpireAt;

            if (finalDisableExpireAt === true) {
                updateData.expireAt = null;
            } else if (expiredDate) {
                updateData.expireAt =
                    expiredDate.endsWith('T23:59:59.000Z') || !/^\d{4}-\d{2}-\d{2}$/.test(expiredDate)
                        ? new Date(expiredDate)
                        : new Date(expiredDate + 'T23:59:59.000Z');
            }
        }

        if (shortDescription !== undefined) updateData.shortDescription = stripHtml(shortDescription);
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
        if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
        if (percentageOff !== undefined) updateData.percentageOff = stripHtml(percentageOff);
        if (purchaseLink !== undefined) updateData.purchaseLink = sanitizeUrl(purchaseLink);
        if (description !== undefined) updateData.description = sanitizeDescription(description);

        if (tags !== undefined) updateData.tags = stripHtml(tags);

        if (hotTrend !== undefined) updateData.hotTrend = hotTrend;
        if (holidayDeals !== undefined) updateData.holidayDeals = holidayDeals;
        if (seasonalDeals !== undefined) updateData.seasonalDeals = seasonalDeals;

        if (coupon !== undefined) updateData.coupon = coupon;

        if (coupons !== undefined) {
            if (Array.isArray(coupons) && coupons.length > 0) {
                updateData.coupons = coupons.map((c) => ({
                    code: stripHtml(c.code),
                    comment: stripHtml(c.comment),
                }));
            } else {
                updateData.coupons = [];
            }
        }

        if (clearance !== undefined) updateData.clearance = clearance;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const existingDeal = await Deal.findById(dealId).select('author');

        if (!existingDeal) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                { status: 404 },
            );
        }

        if (existingDeal.author.toString() !== author) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        if (picture instanceof File && picture.size > 0) {
            try {
                updateData.image = await uploadDealImage(picture, {
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

        updateData.status = 'pending';

        const updatedDeal = await Deal.findByIdAndUpdate(dealId, updateData, { new: true, runValidators: true });

        if (!updatedDeal) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.NOT_FOUND,
                },
                {
                    status: 404,
                },
            );
        }

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.UPDATED,
            data: updatedDeal,
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            {
                status: 500,
            },
        );
    }
}

export async function GET(req: Request, { params }: Props) {
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

        const { searchParams } = new URL(req.url);
        const populate = searchParams.get('populate') === 'true';

        const { id } = await params;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        let query = Deal.findOne({
            _id: id,
            author,
        });

        if (populate) {
            query = query.populate('dealType').populate('store').populate('author');
        }

        const deal = await query.lean();

        if (deal) {
            return NextResponse.json({ success: true, data: deal });
        } else {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 204 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Props) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            const { id } = await params;

            await Deal.findByIdAndDelete(id);

            return NextResponse.json({ success: true, message: MESSAGES.SUCCESS.DELETED });
        } else {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER });
    }
}
