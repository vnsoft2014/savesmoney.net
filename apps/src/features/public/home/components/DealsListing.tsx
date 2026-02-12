'use client';

import { NoDeals } from '@/features/public/deals';
import { getActiveDeals } from '@/services';
import Loading from '@/shared/components/common/Loading';
import { DealFull, DealListResponse } from '@/shared/types';
import { useSearchParams } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { DealCard } from '../../deals/components';

interface Props {
    initDealListResponse: DealListResponse;
}

const DealsListing = ({ initDealListResponse }: Props) => {
    const searchParams = useSearchParams();

    const dealTypeFilter = searchParams.get('dealType') ?? '';
    const storeFilter = searchParams.get('store') ?? '';

    const isMatchingInitialData = dealTypeFilter === '' && storeFilter === '';

    const swrKey = useMemo(() => ['deals', dealTypeFilter, storeFilter] as const, [dealTypeFilter, storeFilter]);

    const fetchDeals = useCallback(async ([, dealType, store]: readonly [string, string, string]) => {
        return getActiveDeals(dealType, store, 1, { limit: 50 });
    }, []);

    const { data: response, isLoading } = useSWR(swrKey, fetchDeals, {
        fallbackData: isMatchingInitialData ? initDealListResponse : undefined,
        revalidateOnMount: isMatchingInitialData ? false : true,
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
    });

    if (!isLoading && response?.data.length === 0) {
        return <NoDeals />;
    }

    const dealCards = useMemo(() => {
        return response?.data.map((deal: DealFull) => <DealCard key={deal._id} deal={deal} />);
    }, [response?.data]);

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex justify-center items-start pt-20">
                    <Loading />
                </div>
            )}

            <div
                className={`grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                ${isLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'}
                transition-opacity`}
            >
                {dealCards}
            </div>
        </div>
    );
};

export default memo(DealsListing);
