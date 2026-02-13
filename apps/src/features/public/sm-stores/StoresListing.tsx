'use client';

import { Pagination } from '@/features/common';
import { getUserStores } from '@/services/user-store';
import { Loading } from '@/shared/components/common';
import { UserStore, UserStoreListResponse } from '@/shared/types';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { NoStores, StoreCard } from './components';
import { StoresSchema } from './seo';

type Props = {
    initStoreListResponse: UserStoreListResponse;
    storeName: string;
    storeSlug: string;
};

const StoresListings = ({ initStoreListResponse, storeName, storeSlug }: Props) => {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;

    const sortFilter = searchParams.get('sort') || '';

    const isInitialState = useMemo(() => {
        return page === 1 && !sortFilter;
    }, [page, sortFilter]);

    const swrKey = useMemo(() => ['stores', sortFilter, page] as const, [sortFilter, page]);

    const fetchUserStores = useCallback(async ([, sort, newPage]: readonly [string, string, number]) => {
        return getUserStores(sort, newPage);
    }, []);

    const { data: response, isValidating } = useSWR(swrKey, fetchUserStores, {
        fallbackData: isInitialState ? initStoreListResponse : undefined,
        revalidateOnMount: !isInitialState,
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
    });

    const storeCards = useMemo(() => {
        return response?.data.map((store: UserStore) => <StoreCard key={store._id} store={store} />);
    }, [response?.data]);

    if (!isValidating && response?.data.length === 0) {
        return <NoStores />;
    }

    return (
        <>
            <StoresSchema typeName={storeName} typeSlug={storeSlug} stores={response?.data || []} />

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
                    {storeCards}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={response?.pagination.totalPages || 0}
                hasNextPage={response?.pagination.hasNextPage || false}
                hasPrevPage={response?.pagination.hasPrevPage || false}
                basePath={`/${storeSlug}`}
            />
        </>
    );
};

export default StoresListings;
