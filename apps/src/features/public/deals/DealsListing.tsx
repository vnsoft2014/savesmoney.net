'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { Pagination } from '@/features/common';
import { DealFull, DealListResponse, GetActiveDealsParams } from '@/shared/types';
import { DealCard, NoDeals } from './components';
import { DealTypeSchema } from './seo';

type Props = {
    initDealListResponse: DealListResponse;
    dealTypeName: string;
    dealTypeSlug: string;
    params: GetActiveDealsParams;
};

const DealsListing = ({ initDealListResponse, params, dealTypeName, dealTypeSlug }: Props) => {
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
            <DealTypeSchema typeName={dealTypeName} typeSlug={dealTypeSlug} deals={initDealListResponse?.data || []} />

            <div className="relative font-sans-condensed">
                <div
                    className={`grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-opacity`}
                >
                    {dealCards}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={initDealListResponse?.pagination.totalPages || 0}
                hasNextPage={initDealListResponse?.pagination.hasNextPage || false}
                hasPrevPage={initDealListResponse?.pagination.hasPrevPage || false}
                basePath={`/${dealTypeSlug}`}
            />
        </>
    );
};

export default DealsListing;
