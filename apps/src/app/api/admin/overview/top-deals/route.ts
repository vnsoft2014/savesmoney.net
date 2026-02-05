import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
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
            { $limit: 10 },
        ]);

        return NextResponse.json({
            success: true,
            data: deals,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
