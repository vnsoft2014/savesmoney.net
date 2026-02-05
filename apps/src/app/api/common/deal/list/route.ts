import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    search: Joi.string().allow('').optional(),
    sortField: Joi.string().valid('createdAt', 'expiredAt', 'originalPrice', 'discountPrice').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    dealType: Joi.string().allow('').optional(),
    dealStore: Joi.string().allow('').optional(),
    createdAtFrom: Joi.string().allow('').optional(),
    createdAtTo: Joi.string().allow('').optional(),
    expireAtFrom: Joi.string().allow('').optional(),
    expireAtTo: Joi.string().allow('').optional(),
    expireAt: Joi.string().valid('null').optional(),
    hotTrend: Joi.boolean().optional(),
    holidayDeals: Joi.boolean().optional(),
    seasonalDeals: Joi.boolean().optional(),
    invalid: Joi.boolean().optional(),
    populate: Joi.string().valid('true', 'false').default('true'),
});

export async function GET(req: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);

        const { value: validatedQuery, error } = querySchema.validate(Object.fromEntries(searchParams), {
            convert: true,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid query parameters: ${error.message}`,
                },
                { status: 400 },
            );
        }

        const {
            page,
            limit,
            search,
            sortField,
            sortOrder,
            dealType,
            dealStore,
            createdAtFrom,
            createdAtTo,
            expireAtFrom,
            expireAtTo,
            expireAt,
            hotTrend,
            holidayDeals,
            seasonalDeals,
            invalid,
            populate,
        } = validatedQuery;

        const skip = (page - 1) * limit;
        const filter: any = {};

        // Search by deal name
        if (search) filter.shortDescription = { $regex: search, $options: 'i' };

        // Filter by deal type
        if (dealType && mongoose.Types.ObjectId.isValid(dealType)) {
            filter.dealType = {
                $in: [new mongoose.Types.ObjectId(dealType)],
            };
        }

        // Filter by deal store
        if (dealStore && mongoose.Types.ObjectId.isValid(dealStore)) {
            filter.store = new mongoose.Types.ObjectId(dealStore);
        }

        // Filter by created date range
        if (createdAtFrom || createdAtTo) {
            filter.createdAt = {};
            if (createdAtFrom) filter.createdAt.$gte = new Date(`${createdAtFrom}T00:00:00.000Z`);
            if (createdAtTo) filter.createdAt.$lte = new Date(`${createdAtTo}T23:59:59.999Z`);
        }

        // Filter by expire date range
        const expireFilters: any[] = [];

        if (expireAtFrom || expireAtTo) {
            const rangeFilter: any = {};
            if (expireAtFrom) {
                const fromDate = new Date(`${expireAtFrom}T00:00:00.000Z`);
                if (!isNaN(fromDate.getTime())) rangeFilter.$gte = fromDate;
            }
            if (expireAtTo) {
                const toDate = new Date(`${expireAtTo}T23:59:59.999Z`);
                if (!isNaN(toDate.getTime())) rangeFilter.$lte = toDate;
            }

            if (Object.keys(rangeFilter).length > 0) {
                expireFilters.push(rangeFilter);
            }
        }

        if (expireAt === 'null') {
            expireFilters.push(null);
        }

        if (expireFilters.length > 0) {
            if (expireFilters.includes(null) && expireFilters.length > 1) {
                filter.$or = expireFilters.map((f) => (f === null ? { expireAt: null } : { expireAt: f }));
            } else {
                filter.expireAt = expireFilters[0];
            }
        }

        if (typeof hotTrend === 'boolean') {
            filter.hotTrend = hotTrend;
        }

        if (typeof holidayDeals === 'boolean') {
            filter.holidayDeals = holidayDeals;
        }

        if (typeof seasonalDeals === 'boolean') {
            filter.seasonalDeals = seasonalDeals;
        }

        if (typeof invalid === 'boolean') {
            if (invalid === true) {
                filter.invalid = true;
            }

            if (invalid === false) {
                filter.$or = [{ invalid: false }, { invalid: { $exists: false } }];
            }
        }

        let query = Deal.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        if (populate) {
            query = query.populate('dealType');
            query = query.populate('store');
        }

        const [deals, totalCount] = await Promise.all([query.lean(), Deal.countDocuments(filter)]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: deals,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
