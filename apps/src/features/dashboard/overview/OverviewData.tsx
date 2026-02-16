'use client';

import { useState } from 'react';
import useSWR from 'swr';

import { StatsCards, TopDealsTable, TopStoresTable } from './components';
import { getOverviewStats, getTopDeals, getTopStores } from './services';

export default function OverviewData() {
    const [activeTab, setActiveTab] = useState<'deals' | 'stores'>('deals');

    const { data: stats, isLoading: isLoadingStats } = useSWR('overview-stats', getOverviewStats);

    const { data: topDeals, isLoading: isLoadingTopDeals } = useSWR(
        activeTab === 'deals' ? 'overview-top-deals' : null,
        getTopDeals,
    );

    const { data: topStores, isLoading: isLoadingTopStores } = useSWR(
        activeTab === 'stores' ? 'overview-top-stores' : null,
        getTopStores,
    );

    if (isLoadingStats) {
        return <div className="p-6 text-sm text-muted-foreground">Loading overview...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Overview</h1>

            {stats && <StatsCards stats={stats} />}

            {/* Tabs */}
            <div>
                <div className="mb-4 flex gap-4 border-b">
                    <button
                        onClick={() => setActiveTab('deals')}
                        className={`pb-2 text-sm font-medium ${
                            activeTab === 'deals' ? 'border-b-2 border-black' : 'text-muted-foreground'
                        }`}
                    >
                        Top Deals
                    </button>

                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`pb-2 text-sm font-medium ${
                            activeTab === 'stores' ? 'border-b-2 border-black' : 'text-muted-foreground'
                        }`}
                    >
                        Top Stores
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'deals' && (
                    <>
                        {isLoadingTopDeals ? (
                            <div className="text-sm text-muted-foreground">Loading deals...</div>
                        ) : (
                            topDeals && <TopDealsTable deals={topDeals} />
                        )}
                    </>
                )}

                {activeTab === 'stores' && (
                    <>
                        {isLoadingTopStores ? (
                            <div className="text-sm text-muted-foreground">Loading stores...</div>
                        ) : (
                            topStores && <TopStoresTable stores={topStores} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
