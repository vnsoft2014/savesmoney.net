import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import DealStats from '@/models/DealStats';
import { UserStore } from '@/models/UserStore';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

        const authenticated = await authUser(req);

        const author = authenticated!.sub;

        const userStore = await UserStore.findOne({ author }).select('_id').lean();

        if (!userStore) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'You must create a store before posting a deal',
                },
                { status: 400 },
            );
        }

        const userStoreId = new mongoose.Types.ObjectId(userStore._id);

        const now = new Date();

        const [totalDeals, hotDeals, invalidDeals, activeDeals, expiredDeals, stats] = await Promise.all([
            Deal.countDocuments({ userStore: userStoreId }),

            Deal.countDocuments({
                userStore: userStoreId,
                hotTrend: true,
            }),

            Deal.countDocuments({
                userStore: userStoreId,
                invalid: true,
            }),

            Deal.countDocuments({
                userStore: userStoreId,
                invalid: false,
                $or: [{ disableExpireAt: true }, { expireAt: null }, { expireAt: { $gte: now } }],
            }),

            Deal.countDocuments({
                userStore: userStoreId,
                expireAt: { $lt: now },
                disableExpireAt: false,
            }),

            DealStats.aggregate([
                {
                    $lookup: {
                        from: 'deals',
                        localField: 'dealId',
                        foreignField: '_id',
                        as: 'dealData',
                    },
                },
                { $unwind: '$dealData' },
                {
                    $match: {
                        'dealData.userStore': userStoreId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: '$views' },
                        totalLikes: { $sum: '$likes' },
                        totalPurchaseClicks: { $sum: '$purchaseClicks' },
                    },
                },
            ]),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalDeals,
                hotDeals,
                invalidDeals,
                activeDeals,
                expiredDeals,
                totalViews: stats[0]?.totalViews || 0,
                totalLikes: stats[0]?.totalLikes || 0,
                totalPurchaseClicks: stats[0]?.totalPurchaseClicks || 0,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
