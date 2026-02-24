'use client';

import { getTopViewedDeals } from '@/services';
import { useEffect, useState } from 'react';
import { PopularDealsSkeleton } from './components';
import PopularDealsItem from './components/PopularDealsItem';

export default function PopularDeals() {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const data = await getTopViewedDeals();
                setDeals(data);
            } catch (error) {
                console.error('Failed to fetch deals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    return (
        <div className="space-y-4">
            <h4 className="font-sans-condensed font-bold">Popular Deals</h4>

            {loading ? (
                <PopularDealsSkeleton />
            ) : deals.length === 0 ? null : (
                <div className="block mt-4 space-y-4">
                    {deals.map((item: any) => (
                        <PopularDealsItem key={item.deal._id} deal={item.deal} />
                    ))}
                </div>
            )}
        </div>
    );
}
