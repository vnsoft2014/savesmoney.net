import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { SitemapItem } from '@/shared/types';
import { getDateRangeFromToday } from '@/utils/deal';
import { pushJson } from '@/utils/seo';
import { NextResponse } from 'next/server';
import pLimit from 'p-limit';

export async function GET() {
    try {
        await connectDB();

        const sitemapJson: SitemapItem[] = [];

        const latestDeal = await Deal.findOne().sort({ createdAt: -1 }).select('createdAt');

        pushJson(sitemapJson, '/', latestDeal?.createdAt);
        pushJson(sitemapJson, '/contact');
        pushJson(sitemapJson, '/deal-alert');
        pushJson(sitemapJson, '/deals', latestDeal?.createdAt);

        const dateRange = getDateRangeFromToday(3);

        const latestDealExpiringSoon = await Deal.findOne({
            $or: [
                { expireAt: null },
                {
                    expireAt: {
                        $gte: new Date(`${dateRange.startDate}T00:00:00.000Z`),
                        $lte: new Date(`${dateRange.endDate}T23:59:59.999Z`),
                    },
                },
            ],
        })
            .sort({ createdAt: -1 })
            .select('createdAt');

        pushJson(sitemapJson, '/expiring-soon', latestDealExpiringSoon?.createdAt);

        const latestDealTrendingDeals = await Deal.findOne({ hotTrend: true })
            .sort({ createdAt: -1 })
            .select('createdAt');
        pushJson(sitemapJson, '/trending-deals', latestDealTrendingDeals?.createdAt);

        const latestDealHolidayDeals = await Deal.findOne({ holidayDeals: true })
            .sort({ createdAt: -1 })
            .select('createdAt');
        pushJson(sitemapJson, '/holiday-deals', latestDealHolidayDeals?.createdAt);

        const latestDealSeasonalDeals = await Deal.findOne({ seasonalDeals: true })
            .sort({ createdAt: -1 })
            .select('createdAt');
        pushJson(sitemapJson, '/seasonal-deals', latestDealSeasonalDeals?.createdAt);

        const pageSize = 200;
        const limit = pLimit(10);

        const createDealSitemapTasks = (totalCount: number, prefix: string) => {
            const totalPages = Math.ceil(totalCount / pageSize);

            return Array.from({ length: totalPages }, (_, i) =>
                limit(async (): Promise<{ loc: string; lastmod?: string }> => {
                    const items = await Deal.find()
                        .sort({ updatedAt: 1 }) // asc
                        .skip(pageSize * i)
                        .limit(pageSize)
                        .select('updatedAt')
                        .lean();

                    return {
                        loc: `/sitemap/${prefix}-${i + 1}.xml`,
                        lastmod: items.at(-1)?.updatedAt?.toISOString(),
                    };
                }),
            );
        };

        const allTasks: Promise<{ loc: string; lastmod?: string }>[] = [];

        const dealCount = await Deal.countDocuments();
        allTasks.push(...createDealSitemapTasks(dealCount, 'deals'));

        const results = await Promise.all(allTasks);

        results.forEach(({ loc, lastmod }) => pushJson(sitemapJson, loc, lastmod));

        return NextResponse.json(sitemapJson);
    } catch (error) {
        return NextResponse.json({ message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
