'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { Pagination } from '@/features/common';
import { getActiveDeals } from '@/services';
import { Loading } from '@/shared/components/common';
import { DealFull, DealListResponse, GetActiveDealsParams } from '@/shared/types';
import useSWR from 'swr';
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

    const dealTypeFilter = searchParams.get('dealType') || '';
    const storeFilter = searchParams.get('store') || '';

    const isInitialState = useMemo(() => {
        return page === 1 && !dealTypeFilter && !storeFilter;
    }, [page, dealTypeFilter, storeFilter]);

    const swrKey = useMemo(
        () => ['deals', dealTypeFilter, storeFilter, page, params] as const,
        [dealTypeFilter, storeFilter, page, params],
    );

    const fetchDeals = useCallback(
        async ([, dealType, store, newPage, query]: readonly [
            string,
            string,
            string,
            number,
            GetActiveDealsParams,
        ]) => {
            return getActiveDeals(dealType, store, newPage, query);
        },
        [],
    );

    const { data: response, isValidating } = useSWR(swrKey, fetchDeals, {
        fallbackData: isInitialState ? initDealListResponse : undefined,
        revalidateOnMount: !isInitialState,
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
    });

    const dealCards = useMemo(() => {
        return response?.data.map((deal: DealFull) => <DealCard key={deal._id} deal={deal} />);
    }, [response?.data]);

    if (!isValidating && response?.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <>
            <DealTypeSchema typeName={dealTypeName} typeSlug={dealTypeSlug} deals={response?.data || []} />

            <div className="relative font-sans-condensed">
                {isValidating && (
                    <div className="absolute inset-0 z-10 flex justify-center items-start pt-20">
                        <Loading />
                    </div>
                )}

                <div
                    className={`grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                            ${isValidating ? 'opacity-30 pointer-events-none' : 'opacity-100'}
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
                basePath={`/${dealTypeSlug}`}
            />
        </>
    );
};

export default DealsListing;
