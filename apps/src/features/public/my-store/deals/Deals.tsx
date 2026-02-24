'use client';

import { Loading } from '@/shared/components/common';
import { DealFull } from '@/shared/types';
import { fetcherWithAuth } from '@/utils/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import { DealCard, DealStatusDialog } from './components';

export default function Deals() {
    const router = useRouter();

    const [selectedDeal, setSelectedDeal] = useState<DealFull | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const [page, setPage] = useState(1);

    const fetcher = async ([, page]: [string, number]) => {
        try {
            const data = await fetcherWithAuth(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-store/deal/list?page=${page}`,
                {
                    credentials: 'include',
                },
            );

            if (!data.success) {
                throw new Error();
            }

            return data;
        } catch (_: unknown) {
            return {
                data: [],
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalCount: 0,
                    limit: 20,
                    hasNextPage: false,
                    hasPrevPage: false,
                },
            };
        }
    };

    const handleDealClick = (deal: DealFull) => {
        if (deal.status === 'pending' || deal.status === 'rejected') {
            setSelectedDeal(deal);
            setOpenDialog(true);
            return;
        }

        router.push(`/deals/deal-detail/${deal.slug}-${deal._id}`);
    };

    const { data, error, isLoading } = useSWR(['user-deals', page], fetcher);

    const dealList = data?.data as DealFull[];
    const pagination = data?.pagination;

    if (isLoading) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <p className="text-red-500">Failed to load deals</p>
            </div>
        );
    }

    return (
        <>
            <div className="container px-3 pt-6 pb-10">
                <div className="mb-4 flex items-center justify-end">
                    <Link
                        href="/my-store/deal/add"
                        prefetch={false}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        + Add Deal
                    </Link>
                </div>

                <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 transition-opacity">
                    {dealList?.map((deal) => <DealCard key={deal._id} deal={deal} onDealClick={handleDealClick} />)}
                </div>

                {pagination && (
                    <div className="flex justify-between items-center mt-4 p-4 border-t">
                        <button
                            disabled={!pagination.hasPrevPage}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm">
                            Page {pagination.currentPage} /
                            <span className="font-bold ml-1">{pagination.totalPages}</span>
                        </span>

                        <button
                            disabled={!pagination.hasNextPage}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <DealStatusDialog deal={selectedDeal} open={openDialog} onOpenChange={setOpenDialog} />
        </>
    );
}
