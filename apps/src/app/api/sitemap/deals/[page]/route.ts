import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { PropsWithPage } from '@/shared/types';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: PropsWithPage) {
    try {
        const { page } = await params;

        await connectDB();

        const pageSize = 200;
        const pageIndex = Number(page) || 1;
        const skip = (pageIndex - 1) * pageSize;

        const deals = await Deal.find({
            status: { $in: ['invalid', 'published'] },
        })
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

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
