import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import DealStats from '@/models/DealStats';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

        const [totalDeals, stats] = await Promise.all([
            Deal.countDocuments(),
            // Deal.countDocuments({ hotTrend: true }),
            // Deal.countDocuments({ invalid: true }),
            // Deal.countDocuments({
            //     $or: [{ expireAt: null }, { expireAt: { $gte: new Date() } }],
            // }),
            // Deal.countDocuments({
            //     expireAt: { $lt: new Date() },
            // }),
            DealStats.aggregate([
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
                hotDeals: 0,
                invalidDeals: 0,
                activeDeals: 0,
                expiredDeals: 0,
                totalViews: stats[0]?.totalViews || 0,
                totalLikes: stats[0]?.totalLikes || 0,
                totalPurchaseClicks: stats[0]?.totalPurchaseClicks || 0,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
