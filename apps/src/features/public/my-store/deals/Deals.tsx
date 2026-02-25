'use client';

import { Pagination } from '@/features/common';
import { Loading } from '@/shared/components/common';
import { DealFull, DealListResponse } from '@/shared/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { NoDeals } from '../../deals';
import { DealCard, DealStatusDialog } from './components';

type Props = {
    initDealListResponse: DealListResponse;
    loading: boolean;
};

const Deals = ({ initDealListResponse, loading }: Props) => {
    const searchParams = useSearchParams();

    const router = useRouter();

    const [selectedDeal, setSelectedDeal] = useState<DealFull | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const page = Number(searchParams.get('page')) || 1;

    const handleDealClick = (deal: DealFull) => {
        if (deal.status === 'pending' || deal.status === 'rejected') {
            setSelectedDeal(deal);
            setOpenDialog(true);
            return;
        }

        router.push(`/deals/deal-detail/${deal.slug}-${deal._id}`);
    };

    const dealCards = useMemo(() => {
        return initDealListResponse?.data.map((deal: DealFull) => (
            <DealCard key={deal._id} deal={deal} onDealClick={handleDealClick} />
        ));
    }, [initDealListResponse?.data]);

    if (loading) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (initDealListResponse?.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <>
            <div className="relative font-sans-condensed">
                <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 transition-opacity">
                    {dealCards}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={initDealListResponse?.pagination.totalPages || 0}
                hasNextPage={initDealListResponse?.pagination.hasNextPage || false}
                hasPrevPage={initDealListResponse?.pagination.hasPrevPage || false}
                basePath={`/my-store/deals`}
            />

            <DealStatusDialog deal={selectedDeal} open={openDialog} onOpenChange={setOpenDialog} />
        </>
    );
};

export default Deals;
