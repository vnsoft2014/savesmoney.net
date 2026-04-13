import { MESSAGES } from '@/config/messages';
import connectDB from '@/lib/db/connectDB';
import Deal from '@/models/Deal';
import DealType from '@/models/DealType';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    try {
        await connectDB();

        const now = new Date();

        const latestDeals = await Deal.aggregate([
            {
                $match: {
                    status: { $in: ['published', 'invalid'] },
                    $or: [{ disableExpireAt: true }, { expireAt: null }, { expireAt: { $gt: now } }],
                },
            },
            { $unwind: '$dealType' },
            {
                $group: {
                    _id: '$dealType',
                    latestCreatedAt: { $max: '$createdAt' },
                },
            },
        ]);

        const latestMap = new Map<string, Date>();
        latestDeals.forEach((item) => {
            latestMap.set(item._id.toString(), item.latestCreatedAt);
        });

        const dealTypes = await DealType.find().select('slug').lean();

        const results = dealTypes.map((type) => ({
            loc: `/deals/${type.slug}-${type._id}`,
            lastmod: latestMap.get(type._id.toString())
                ? new Date(latestMap.get(type._id.toString())!).toISOString()
                : undefined,
            changefreq: 'daily',
            priority: 0.8,
        }));

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
