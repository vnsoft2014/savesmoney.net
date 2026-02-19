'use client';

import { Pagination } from '@/features/common';
import { UserStore, UserStoreListResponse } from '@/shared/types';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
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

    const storeCards = useMemo(() => {
        return initStoreListResponse?.data.map((store: UserStore) => <StoreCard key={store._id} store={store} />);
    }, [initStoreListResponse?.data]);

    if (initStoreListResponse?.data.length === 0) {
        return <NoStores />;
    }

    return (
        <>
            <StoresSchema typeName={storeName} typeSlug={storeSlug} stores={initStoreListResponse?.data || []} />

            <div className="relative font-sans-condensed">
                <div
                    className={`grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-opacity`}
                >
                    {storeCards}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={initStoreListResponse?.pagination.totalPages || 0}
                hasNextPage={initStoreListResponse?.pagination.hasNextPage || false}
                hasPrevPage={initStoreListResponse?.pagination.hasPrevPage || false}
                basePath={`/${storeSlug}`}
            />
        </>
    );
};

export default StoresListings;
