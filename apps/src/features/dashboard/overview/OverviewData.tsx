'use client';

import { getOverviewStats, getTopDeals } from '@/services/admin/overview';
import useSWR from 'swr';
import { StatsCards, TopDealsTable } from './components';

export default function OverviewData() {
    const { data: stats, isLoading: isLoadingStats, error: statsError } = useSWR('overview-stats', getOverviewStats);

    const {
        data: topDeals,
        isLoading: isLoadingTopDeals,
        error: topDealsError,
    } = useSWR('overview-top-deals', getTopDeals);

    if (isLoadingStats || isLoadingTopDeals) {
        return <div className="p-6 text-sm text-muted-foreground">Loading overview...</div>;
    }

    if (statsError || topDealsError) {
        return <div className="p-6 text-red-500">Failed to load overview data</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Overview</h1>

            {stats && <StatsCards stats={stats} />}

            <div>
                <h2 className="mb-3 text-lg font-semibold">Top Deals</h2>
                {topDeals && <TopDealsTable deals={topDeals} />}
            </div>
        </div>
    );
}
