import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import Store from '@/models/Store';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const querySchema = Joi.object({
    query: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    dealType: Joi.string().allow('').optional(),
    dealStore: Joi.string().allow('').optional(),
});

export async function GET(req: NextRequest) {
    try {
        await connectDB();

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

        const { query, page, limit, dealType, dealStore } = validatedQuery;

        let storeIdsFromQuery: mongoose.Types.ObjectId[] = [];

        if (query) {
            const stores = await Store.find({
                name: { $regex: query, $options: 'i' },
            }).select('_id');

            storeIdsFromQuery = stores.map((s) => s._id);
        }

        const today = new Date();
        const fromDate = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z');

        const filter: any = {
            $or: [{ expireAt: { $gte: fromDate } }, { expireAt: null }],
        };

        if (query) {
            filter.$and = [
                {
                    $or: [
                        { shortDescription: { $regex: query, $options: 'i' } },
                        ...(storeIdsFromQuery.length ? [{ store: { $in: storeIdsFromQuery } }] : []),
                    ],
                },
            ];
        }

        if (dealType && mongoose.Types.ObjectId.isValid(dealType)) {
            filter.dealType = new mongoose.Types.ObjectId(dealType);
        }

        if (dealStore && mongoose.Types.ObjectId.isValid(dealStore)) {
            filter.store = new mongoose.Types.ObjectId(dealStore);
        }

        const skip = (page - 1) * limit;
        const totalCount = await Deal.countDocuments(filter);

        const deals = await Deal.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('dealType')
            .populate('store')
            .lean();

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
    } catch (err) {
        return NextResponse.json({ error: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
