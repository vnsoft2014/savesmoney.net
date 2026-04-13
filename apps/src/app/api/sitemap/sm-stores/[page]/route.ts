import { MESSAGES } from '@/config/messages';
import connectDB from '@/lib/db/connectDB';
import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';
import { PropsWithPage } from '@/types';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: PropsWithPage) {
    try {
        const { page } = await params;

        await connectDB();

        const pageSize = 200;
        const pageIndex = Number(page) || 1;
        const skip = (pageIndex - 1) * pageSize;

        const stores = await UserStore.find({ isActive: true })
            .select('_id slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const storeIds = stores.map((s) => s._id);

        const latestDeals = await Deal.aggregate([
            {
                $match: {
                    userStore: { $in: storeIds },
                    status: { $in: ['published', 'invalid'] },
                },
            },
            {
                $sort: { updatedAt: -1 },
            },
            {
                $group: {
                    _id: '$userStore',
                    lastUpdated: { $first: '$updatedAt' },
                },
            },
        ]);

        const dealMap = new Map<string, Date>();

        latestDeals.forEach((d) => {
            dealMap.set(d._id.toString(), d.lastUpdated);
        });

        const results = stores.map((store) => {
            const lastmod = dealMap.get(store._id.toString());

            return {
                loc: `/stores/${store.slug}`,
                lastmod: lastmod ? new Date(lastmod).toISOString() : undefined,
                changefreq: 'weekly',
                priority: 0.7,
            };
        });

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
