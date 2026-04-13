'use client';

import { NoDeals } from '@/features/public/deals';
import { DealFull, DealListResponse } from '@/types';
import { memo, useMemo } from 'react';
import { DealCard } from '../../deals/components';
import { Pagination } from '@/features/common';
import { useSearchParams } from 'next/navigation';

interface Props {
    initDealListResponse: DealListResponse;
}

const DealsListing = ({ initDealListResponse }: Props) => {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;

    const dealCards = useMemo(() => {
        return initDealListResponse?.data.map((deal: DealFull) => <DealCard key={deal._id} deal={deal} />);
    }, [initDealListResponse?.data]);

    if (initDealListResponse?.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <>
            <div className="relative font-sans-condensed">
                <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-opacity">
                    {dealCards}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={initDealListResponse?.pagination.totalPages || 0}
                hasNextPage={initDealListResponse?.pagination.hasNextPage || false}
                hasPrevPage={initDealListResponse?.pagination.hasPrevPage || false}
                basePath={`/`}
            />
        </>
    );
};

export default memo(DealsListing);
