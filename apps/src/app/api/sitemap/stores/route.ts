import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import Store from '@/models/Store';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    try {
        await connectDB();

        const now = new Date();

        const latestDeals = await Deal.aggregate([
            {
                $match: {
                    status: 'published',
                    $or: [{ disableExpireAt: true }, { expireAt: null }, { expireAt: { $gt: now } }],
                },
            },
            {
                $group: {
                    _id: '$store',
                    latestCreatedAt: { $max: '$createdAt' },
                },
            },
        ]);

        const latestMap = new Map<string, Date>();
        latestDeals.forEach((item) => {
            if (item._id) {
                latestMap.set(item._id.toString(), item.latestCreatedAt);
            }
        });

        const stores = await Store.find().select('slug').lean();

        const results = stores.map((store) => ({
            loc: `/store/${store.slug}-${store._id}`,
            lastmod: latestMap.get(store._id.toString())
                ? new Date(latestMap.get(store._id.toString())!).toISOString()
                : undefined,
            changefreq: 'daily',
            priority: 0.8,
        }));

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
