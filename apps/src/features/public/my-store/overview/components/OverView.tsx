'use client';

import { useState } from 'react';

import { DealRaw, Store } from '@/shared/types';
import DealsTab from './DealsTab';
import StatsSection from './StatsSection';
import StoresTab from './StoresTab';
import TopDealsTab from './TopDealsTab';

type OverviewData = {
    stats: any;
    deals: DealRaw[];
    stores: Store[];
};

export default function Overview() {
    const [activeTab, setActiveTab] = useState<'deals' | 'top-deals' | 'stores'>('deals');

    return (
        <div className="space-y-6 md:space-y-8 bg-slate-50/50">
            <StatsSection />

            <div className="min-h-[80vh]">
                <div className="flex bg-white border border-gray-100 shadow-xs border-b">
                    {['deals', 'top-deals', 'stores'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === tab ? 'border-b-2 border-black' : 'text-muted-foreground'
                            }`}
                        >
                            {tab === 'deals' ? 'Deals' : tab === 'top-deals' ? 'Top Deals' : 'Top Stores'}
                        </button>
                    ))}
                </div>

                <div className="pt-4 grid grid-cols-1">
                    {/* Tab Deals */}
                    <div
                        className={`col-start-1 row-start-1 ${
                            activeTab === 'deals' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
                        }`}
                    >
                        <DealsTab />
                    </div>

                    {/* Tab Top Deals */}
                    <div
                        className={`col-start-1 row-start-1 ${
                            activeTab === 'top-deals' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
                        }`}
                    >
                        <TopDealsTab />
                    </div>

                    {/* Tab Stores */}
                    <div
                        className={`col-start-1 row-start-1 ${
                            activeTab === 'stores' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
                        }`}
                    >
                        <StoresTab />
                    </div>
                </div>
            </div>
        </div>
    );
}
