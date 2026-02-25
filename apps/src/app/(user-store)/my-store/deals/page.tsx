'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DealsFilters } from '@/features/public/deals';
import Deals from '@/features/public/my-store/deals/Deals';
import { MyStoreShell } from '@/features/public/my-store/overview';
import { getDeals } from '@/features/public/my-store/services';
import { getDealTypes, getStores } from '@/services';
import Link from 'next/link';

const Page = () => {
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [dealListResponse, setDealListResponse] = useState<any>(null);
    const [dealTypes, setDealTypes] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);

    const dealType = searchParams.get('dealType') || '';
    const store = searchParams.get('store') || '';
    const pageNum = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [dealsRes, dealTypesRes, storesRes] = await Promise.all([
                    getDeals(dealType, store, pageNum),
                    getDealTypes(),
                    getStores(),
                ]);

                setDealListResponse(dealsRes);
                setDealTypes(dealTypesRes);
                setStores(storesRes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dealType, store, pageNum]);

    return (
        <MyStoreShell title="All Deals">
            <div className="container space-y-4 px-3 pt-6 pb-10">
                <div className="flex items-center justify-between">
                    <Link
                        href="/my-store/deal/add"
                        prefetch={false}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        + Add Deal
                    </Link>

                    <DealsFilters dealTypes={dealTypes} stores={stores} />
                </div>
                <Deals initDealListResponse={dealListResponse} loading={loading} />
            </div>
        </MyStoreShell>
    );
};

export default Page;
