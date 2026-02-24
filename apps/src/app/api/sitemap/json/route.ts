import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';
import { SitemapItem } from '@/shared/types';
import { getDateRangeFromToday } from '@/utils/deal';
import { pushJson } from '@/utils/seo';
import { NextResponse } from 'next/server';
import { createDealSitemapTasks, createUserStoreSitemapTasks } from './utils';

export async function GET() {
    try {
        await connectDB();

        const sitemapJson: SitemapItem[] = [];

        const latestDeal = await Deal.findOne().sort({ createdAt: -1 }).select('createdAt');

        pushJson(sitemapJson, '/', latestDeal?.createdAt);
        pushJson(sitemapJson, '/contact');
        pushJson(sitemapJson, '/deal-alert');
        pushJson(sitemapJson, '/deals', latestDeal?.createdAt);

        const latestUserStore = await UserStore.findOne().sort({ createdAt: -1 }).select('createdAt');

        pushJson(sitemapJson, '/sm-stores', latestUserStore?.createdAt);

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

        pushJson(sitemapJson, '/sitemap/deal-types.xml', '2026-02-20T14:17:33.205Z');
        pushJson(sitemapJson, '/sitemap/stores.xml', '2026-02-20T14:10:33.205Z');

        const allTasks: Promise<{ loc: string; lastmod?: string }>[] = [];

        const userStoreCount = await UserStore.countDocuments();
        allTasks.push(...createUserStoreSitemapTasks(userStoreCount, 'sm-stores'));

        const dealCount = await Deal.countDocuments();
        allTasks.push(...createDealSitemapTasks(dealCount, 'deals'));

        const results = await Promise.all(allTasks);

        results.forEach(({ loc, lastmod }) => pushJson(sitemapJson, loc, lastmod));

        return NextResponse.json(sitemapJson);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch json' }, { status: 500 });
    }
}
