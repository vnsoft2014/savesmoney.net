'use client';

import { NoDeals } from '@/features/public/deals';
import { DealFull, DealListResponse } from '@/shared/types';
import { memo, useMemo } from 'react';
import { DealCard } from '../../deals/components';

interface Props {
    initDealListResponse: DealListResponse;
}

const DealsListing = ({ initDealListResponse }: Props) => {
    const dealCards = useMemo(() => {
        return initDealListResponse?.data.map((deal: DealFull) => <DealCard key={deal._id} deal={deal} />);
    }, [initDealListResponse?.data]);

    if (initDealListResponse?.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <div className="relative font-sans-condensed">
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-opacity">
                {dealCards}
            </div>
        </div>
    );
};

export default memo(DealsListing);
