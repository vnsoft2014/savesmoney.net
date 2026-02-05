import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { page: string } }) {
    try {
        await connectDB();

        //const cacheKey = `deals:page:${params.page}`;

        // const cached = await redis.get(cacheKey);
        // if (cached) {
        //     return NextResponse.json(JSON.parse(cached));
        // }

        const pageSize = 200;
        const pageIndex = Number(params.page) || 1;
        const skip = (pageIndex - 1) * pageSize;

        const deals = await Deal.find()
            .select('slug updatedAt')
            .sort({ updatedAt: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const results = deals.map((deal) => ({
            loc: `/deals/deal-detail/${deal.slug}-${deal._id}`,
            lastmod: deal.updatedAt ? new Date(deal.updatedAt).toISOString() : undefined,
            changefreq: 'weekly',
            priority: 0.8,
        }));

        //await redis.set(cacheKey, JSON.stringify(results), 'EX', 600);

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
