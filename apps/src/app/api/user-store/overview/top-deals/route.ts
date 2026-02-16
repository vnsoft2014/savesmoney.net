import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import DealStats from '@/models/DealStats';
import { UserStore } from '@/models/UserStore';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const querySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(20),
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

        const { value, error } = querySchema.validate(
            {
                limit: searchParams.get('limit'),
            },
            { convert: true },
        );

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

        const dealMatch: any = {
            'deal.status': 'published',
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

        dealMatch['deal.userStore'] = new mongoose.Types.ObjectId(userStore._id);

        const deals = await DealStats.aggregate([
            {
                $lookup: {
                    from: 'deals',
                    localField: 'dealId',
                    foreignField: '_id',
                    as: 'deal',
                },
            },

            { $unwind: '$deal' },

            { $match: dealMatch },

            {
                $project: {
                    views: 1,
                    likes: 1,
                    purchaseClicks: 1,
                    'deal._id': 1,
                    'deal.shortDescription': 1,
                    'deal.slug': 1,
                    'deal.image': 1,
                },
            },

            { $sort: { views: -1 } },

            { $limit: limit },
        ]);

        return NextResponse.json({
            success: true,
            data: deals,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
