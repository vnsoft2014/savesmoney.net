import Joi from 'joi';
import { NextRequest, NextResponse } from 'next/server';

import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';

export const dynamic = 'force-dynamic';

const querySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(10),
});

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(req.url);

        const query = {
            limit: searchParams.get('limit'),
        };

        const { value, error } = querySchema.validate(query, {
            convert: true,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.details[0].message,
                },
                { status: 400 },
            );
        }

        const { limit } = value;

        const stores = await Deal.aggregate([
            {
                $lookup: {
                    from: 'dealstats',
                    localField: '_id',
                    foreignField: 'dealId',
                    as: 'stats',
                },
            },

            {
                $unwind: {
                    path: '$stats',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $group: {
                    _id: '$store',
                    totalViews: { $sum: { $ifNull: ['$stats.views', 0] } },
                    totalLikes: { $sum: { $ifNull: ['$stats.likes', 0] } },
                    totalDeals: { $sum: 1 },
                },
            },

            {
                $addFields: {
                    score: { $add: ['$totalViews', '$totalLikes'] },
                },
            },

            { $sort: { score: -1 } },

            { $limit: limit },

            {
                $lookup: {
                    from: 'stores',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'store',
                },
            },

            { $unwind: '$store' },

            {
                $project: {
                    _id: 0,
                    storeId: '$_id',
                    name: '$store.name',
                    slug: '$store.slug',
                    thumbnail: '$store.thumbnail',
                    totalViews: 1,
                    totalLikes: 1,
                    totalDeals: 1,
                    score: 1,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: stores,
        });
    } catch (error) {
        console.error('Top Stores Error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 },
        );
    }
}
