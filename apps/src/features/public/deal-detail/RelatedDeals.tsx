'use client';

import { getRelatedDeals } from '@/services';
import { DealFull } from '@/shared/types';
import { useEffect, useState } from 'react';
import { RelatedDealsSkeleton } from './components';
import RelatedDealsClient from './components/RelatedDealsClient';

interface Props {
    dealId: string;
    storeName: string;
    storeSlug: string;
    storeId: string;
}

export default function RelatedDeals({ dealId, storeName, storeSlug, storeId }: Props) {
    const [deals, setDeals] = useState<DealFull[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const deals = await getRelatedDeals(dealId, storeId);

                setDeals(deals);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, [dealId, storeId]);

    if (loading) {
        return <RelatedDealsSkeleton storeName={storeName} />;
    }

    if (!deals.length) return null;

    return (
        <RelatedDealsClient
            dealId={dealId}
            storeName={storeName}
            storeSlug={storeSlug}
            storeId={storeId}
            deals={deals}
        />
    );
}
