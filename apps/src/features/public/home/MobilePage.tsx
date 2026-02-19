'use client';

import { DealListResponse, DealType, Store } from '@/shared/types';
import { memo, useState } from 'react';
import { DealTypesGrid } from './components';
import ActiveDealsTab from './components/ActiveDealsTab';
import StoresSlider from './components/StoresSlider';
import { HomeSchema } from './seo';

interface Props {
    dealListResponse: DealListResponse;
    dealTypes: DealType[];
    stores: Store[];
}

type TabKey = 'deal-types' | 'deals';

interface TabButtonProps {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}

const TabButton = memo(({ active, children, onClick }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm border-b-2 font-semibold transition
            ${active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}
        `}
    >
        {children}
    </button>
));

TabButton.displayName = 'TabButton';

const MobilePage = ({ dealListResponse, dealTypes, stores }: Props) => {
    const [activeTab, setActiveTab] = useState<TabKey>('deal-types');

    return (
        <>
            <HomeSchema />

            <div className="flex items-center justify-around gap-2 font-sans-condensed border-b bg-white">
                <TabButton active={activeTab === 'deal-types'} onClick={() => setActiveTab('deal-types')}>
                    Deal Types
                </TabButton>

                <TabButton active={activeTab === 'deals'} onClick={() => setActiveTab('deals')}>
                    Deals
                </TabButton>
            </div>

            <div className="container mx-auto px-3 font-sans-condensed">
                {activeTab === 'deal-types' && (
                    <div className="py-4 space-y-6">
                        <StoresSlider stores={stores} />

                        <DealTypesGrid dealTypes={dealTypes} />
                    </div>
                )}

                {activeTab === 'deals' && <ActiveDealsTab deals={dealListResponse.data} />}
            </div>
        </>
    );
};

export default MobilePage;
