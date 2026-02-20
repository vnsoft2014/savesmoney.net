import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { Coupon } from '@/models/Coupon';
import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';
import { DealFormValues } from '@/shared/types';
import { validateRequest } from '@/utils/validators/validate';
import Joi from 'joi';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

const ClientDealSchema = Joi.object({
    picture: Joi.string().allow(null),
    dealType: Joi.array().items(Joi.string()).min(1).required(),
    store: Joi.string().required(),
    expireAt: Joi.string()
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
    discountPrice: Joi.number().min(0).optional().allow(null),
    percentageOff: Joi.string().allow('').optional(),

    purchaseLink: Joi.string().uri().required(),
    description: Joi.string().required(),
    flashDeal: Joi.boolean().optional(),
    flashDealExpireHours: Joi.number().min(1).allow(null).optional(),
    tags: Joi.array().items(Joi.string().trim().min(1)).optional().default([]),

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

        const { isValid, value, response } = await validateRequest(req, ClientDealSchema);
        if (!isValid) return response;

        const deal = value as DealFormValues;

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const [existingDeal, userStore] = await Promise.all([
            Deal.findOne({
                author: author,
                $or: [{ purchaseLink: deal.purchaseLink }, { shortDescription: deal.shortDescription }],
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
                    message: 'Duplicate data exists',
                    duplicates: {
                        purchaseLink: existingDeal.purchaseLink === deal.purchaseLink ? deal.purchaseLink : null,
                        shortDescription:
                            existingDeal.shortDescription === deal.shortDescription ? deal.shortDescription : null,
                    },
                },
                { status: 409 },
            );
        }

        const { disableExpireAt, flashDeal, flashDealExpireHours, coupon, coupons, clearance } = deal;

        let expireAt: Date | null = null;

        if (flashDeal) {
            expireAt = new Date(Date.now() + flashDealExpireHours! * 60 * 60 * 1000);
        } else {
            const finalDisableExpireAt = coupon === true || clearance === true ? true : Boolean(disableExpireAt);

            if (!finalDisableExpireAt && deal.expireAt) {
                expireAt = new Date(deal.expireAt + 'T23:59:59.000Z');
            }
        }

        let userStoreId = null;

        if (userStore) {
            userStoreId = userStore._id;
        }

        let couponIds = [];
        if (coupons !== undefined) {
            if (coupons.length > 0) {
                const createdCoupons = await Coupon.insertMany(coupons);
                couponIds = createdCoupons.map((c) => c._id);
            }
        }

        const slug = slugify(deal.shortDescription, { lower: true, strict: true });

        const newDeal = await Deal.create({
            image: deal.picture ?? null,
            dealType: deal.dealType,
            store: deal.store,
            expireAt,

            shortDescription: deal.shortDescription,
            slug,
            originalPrice: deal.originalPrice,
            discountPrice: deal.discountPrice,
            percentageOff: deal.percentageOff,
            purchaseLink: deal.purchaseLink,
            description: deal.description,

            flashDeal: deal.flashDeal ?? false,
            flashDealExpireHours: deal.flashDealExpireHours ?? null,
            tags: deal.tags ?? [],

            hotTrend: deal.hotTrend ?? false,
            holidayDeals: deal.holidayDeals ?? false,
            seasonalDeals: deal.seasonalDeals ?? false,

            coupon: deal.coupon ?? false,
            coupons: couponIds,
            clearance: deal.clearance ?? false,
            disableExpireAt: deal.disableExpireAt ?? false,

            userStore: userStoreId,
            author,

            source: 'user',
            status: 'pending',
        });

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
