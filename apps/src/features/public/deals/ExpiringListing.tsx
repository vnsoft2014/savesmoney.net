'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { getExpiringSoon } from '@/services';
import { Loading } from '@/shared/components/common';
import { DealFull, DealListResponse } from '@/shared/types';
import useSWR from 'swr';
import { DealCard } from './components';
import Pagination from './components/Pagination';
import NoDeals from './NoDeals';
import DealTypeSchema from './seo/DealTypeSchema';

type Props = {
    initDealListResponse: DealListResponse;
};

const ExpiringListing = ({ initDealListResponse }: Props) => {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;
    const dealTypeFilter = searchParams.get('dealType') || '';
    const storeFilter = searchParams.get('store') || '';

    const isInitialState = useMemo(() => {
        return page === 1 && !dealTypeFilter && !storeFilter;
    }, [page, dealTypeFilter, storeFilter]);

    const swrKey = useMemo(
        () => ['deals', dealTypeFilter, storeFilter, page] as const,
        [dealTypeFilter, storeFilter, page],
    );

    const fetchDeals = useCallback(async ([, dealType, store, newPage]: readonly [string, string, string, number]) => {
        return getExpiringSoon(dealType, store, newPage);
    }, []);

    const { data: response, isLoading } = useSWR(swrKey, fetchDeals, {
        fallbackData: isInitialState ? initDealListResponse : undefined,
        revalidateOnMount: !isInitialState,
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
    });

    const dealCards = useMemo(() => {
        return response?.data.map((deal: DealFull) => <DealCard key={deal._id} deal={deal} />);
    }, [response?.data]);

    if (!isLoading && response?.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <>
            <DealTypeSchema typeName="Expiring Soon" typeSlug="expiring-soon" deals={response?.data || []} />

            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex justify-center items-start pt-20">
                        <Loading />
                    </div>
                )}

                <div
                    className={`grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5
                            ${isLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'}
                            transition-opacity`}
                >
                    {dealCards}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={response?.pagination.totalPages || 0}
                hasNextPage={response?.pagination.hasNextPage || false}
                hasPrevPage={response?.pagination.hasPrevPage || false}
                basePath="/expiring-soon"
            />
        </>
    );
};

export default ExpiringListing;
