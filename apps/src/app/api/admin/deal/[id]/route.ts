import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY, ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { Coupon } from '@/models/Coupon';
import Deal from '@/models/Deal';
import { validateRequest } from '@/utils/validators/validate';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const UpdateDealSchema = Joi.object({
    _id: Joi.string().required(),

    picture: Joi.string().optional(),

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
    discountPrice: Joi.number().min(0).required(),
    percentageOff: Joi.string().optional(),

    purchaseLink: Joi.string().uri().optional(),
    description: Joi.string().optional(),
    flashDeal: Joi.boolean().optional(),
    flashDealExpireHours: Joi.number().min(1).allow(null).optional(),

    tags: Joi.array().items(Joi.string().trim().min(1)).optional().default([]),

    hotTrend: Joi.boolean().optional(),
    holidayDeals: Joi.boolean().optional(),
    seasonalDeals: Joi.boolean().optional(),

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
    disableExpireAt: Joi.boolean().optional(),
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
    const { isValid, value, response } = await validateRequest(req, UpdateDealSchema);
    if (!isValid) return response;

    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json({
                success: false,
                message: MESSAGES.ERROR.FORBIDDEN,
            });
        }

        const { id: dealId } = await params;

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

        if (picture !== undefined) updateData.image = picture;
        if (dealType !== undefined) updateData.dealType = dealType;
        if (store !== undefined) updateData.store = store;

        if (flashDeal !== undefined) {
            updateData.flashDeal = flashDeal;
        }

        if (flashDeal) {
            const existingDeal = await Deal.findById(dealId).select('flashDealExpireHours');

            updateData.disableExpireAt = false;

            const hasExpireHoursChanged =
                flashDealExpireHours !== undefined && flashDealExpireHours !== existingDeal?.flashDealExpireHours;

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

        if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
        if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
        if (percentageOff !== undefined) updateData.percentageOff = percentageOff;
        if (purchaseLink !== undefined) updateData.purchaseLink = purchaseLink;
        if (description !== undefined) updateData.description = description;

        if (tags !== undefined) updateData.tags = tags;

        if (hotTrend !== undefined) updateData.hotTrend = hotTrend;
        if (holidayDeals !== undefined) updateData.holidayDeals = holidayDeals;
        if (seasonalDeals !== undefined) updateData.seasonalDeals = seasonalDeals;

        if (coupon !== undefined) updateData.coupon = coupon;
        if (coupons !== undefined) {
            if (coupons.length > 0) {
                const createdCoupons = await Coupon.insertMany(coupons);
                updateData.coupons = createdCoupons.map((c) => c._id);
            } else {
                updateData.coupons = [];
            }
        }

        if (clearance !== undefined) updateData.clearance = clearance;

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
