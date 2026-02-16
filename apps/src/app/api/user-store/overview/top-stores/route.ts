import Joi from 'joi';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';

export const dynamic = 'force-dynamic';

const querySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(20),
});

export async function GET(req: NextRequest) {
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

        const matchStage: any = {
            status: 'published',
        };

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

        matchStage.userStore = new mongoose.Types.ObjectId(userStore._id);

        const stores = await Deal.aggregate([
            { $match: matchStage },

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
