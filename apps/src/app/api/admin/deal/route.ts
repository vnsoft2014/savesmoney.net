import { MESSAGES } from '@/config/messages';
import { ADMIN_ROLES } from '@/config/user';
import connectDB from '@/lib/db/connectDB';
import { sanitizeDescription, sanitizeUrl, stripHtml } from '@/lib/sanitize';
import { validateRequest } from '@/lib/validators/validate';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import { DealFormValues } from '@/types';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ClientDealSchema = Joi.object({
    picture: Joi.string().allow(null),
    images: Joi.array().items(Joi.string()).optional(),
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
    discountPrice: Joi.number().min(0).default(0),
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
                comment: Joi.string().trim().allow(null, '').optional(),
            }),
        )
        .optional()
        .default([]),

    clearance: Joi.boolean().default(false),
    disableExpireAt: Joi.boolean().default(false),
    author: Joi.string().required(),
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

const AddMultipleDealsSchema = Joi.array().items(ClientDealSchema).min(1);

export async function POST(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                {
                    status: 403,
                },
            );
        }

        const { isValid, value, response } = await validateRequest(req, AddMultipleDealsSchema);
        if (!isValid) return response;

        const data = value as DealFormValues[];

        const purchaseLinks = data.map((d) => d.purchaseLink);
        const duplicateInRequest = purchaseLinks.filter((link, index) => purchaseLinks.indexOf(link) !== index);

        if (duplicateInRequest.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Duplicate purchaseLink in request',
                },
                { status: 400 },
            );
        }

        const shortDescriptions = data.map((d) => d.shortDescription?.trim().toLowerCase());

        const duplicateShortDescInRequest = shortDescriptions.filter(
            (desc, index) => shortDescriptions.indexOf(desc) !== index,
        );

        if (duplicateShortDescInRequest.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Duplicate shortDescription in request',
                },
                { status: 400 },
            );
        }

        const existingDeals = await Deal.find({
            $or: [
                { purchaseLink: { $in: purchaseLinks } },
                { shortDescription: { $in: data.map((d) => d.shortDescription) } },
            ],
        }).select('purchaseLink shortDescription');

        if (existingDeals.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Duplicate data exists',
                    duplicates: {
                        purchaseLink: existingDeals.map((d) => d.purchaseLink).filter(Boolean),
                        shortDescription: existingDeals.map((d) => d.shortDescription).filter(Boolean),
                    },
                },
                { status: 409 },
            );
        }

        const dealsToSave = [];

        for (const deal of data) {
            const { disableExpireAt, flashDeal, flashDealExpireHours, coupon, coupons, clearance } = deal;

            let expireAt = null;

            if (flashDeal) {
                deal.disableExpireAt = false;
                expireAt = new Date(Date.now() + flashDealExpireHours! * 60 * 60 * 1000);
            } else {
                const finalDisableExpireAt = coupon === true || clearance === true ? true : Boolean(disableExpireAt);

                deal.flashDealExpireHours = null;
                deal.disableExpireAt = finalDisableExpireAt;

                if (finalDisableExpireAt === true) {
                    expireAt = null;
                } else if (deal.expireAt) {
                    expireAt = new Date(deal.expireAt + 'T23:59:59.000Z');
                }
            }

            let couponsCleaned;
            if (coupons !== undefined) {
                if (Array.isArray(coupons) && coupons.length > 0) {
                    couponsCleaned = coupons.map((c) => ({
                        code: stripHtml(c.code),
                        comment: stripHtml(c.comment),
                    }));
                } else {
                    couponsCleaned = [];
                }
            }

            dealsToSave.push({
                image: deal.picture ?? null,
                images: deal.images ?? [],
                dealType: deal.dealType,
                store: deal.store,

                expireAt,

                shortDescription: stripHtml(deal.shortDescription),
                originalPrice: deal.originalPrice,
                discountPrice: deal.discountPrice,
                percentageOff: stripHtml(deal.percentageOff),
                purchaseLink: sanitizeUrl(deal.purchaseLink),
                description: sanitizeDescription(deal.description),
                flashDeal,
                flashDealExpireHours: deal.flashDealExpireHours,
                coupons: couponsCleaned,
                tags: stripHtml(deal.tags) ?? [],

                hotTrend: deal.hotTrend ?? false,
                holidayDeals: deal.holidayDeals ?? false,
                seasonalDeals: deal.seasonalDeals ?? false,

                coupon: deal.coupon ?? false,
                clearance: deal.clearance ?? false,

                disableExpireAt: deal.disableExpireAt ?? false,

                author: deal.author,
            });
        }

        const savedDeals = await Deal.insertMany(dealsToSave);

        return NextResponse.json(
            {
                success: true,
                message: `Successfully added ${savedDeals.length} deal(s)`,
                count: savedDeals.length,
                data: savedDeals,
            },
            { status: 200 },
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
