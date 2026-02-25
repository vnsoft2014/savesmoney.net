'use client';

import { DealsFilters } from '@/features/public/deals';
import { DealPrice } from '@/features/public/deals/components';
import { getDealTypes, getStores } from '@/services';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/shadecn/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';
import { DealFull, DealListResponse } from '@/shared/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DealStatusBadge, DealStatusDialog } from '../../deals/components';
import { getDeals } from '../../services';

export default function DealsTab() {
    const searchParams = useSearchParams();

    const router = useRouter();

    const [selectedDeal, setSelectedDeal] = useState<DealFull | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [dealListResponse, setDealListResponse] = useState<DealListResponse>();
    const [dealTypes, setDealTypes] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);

    const dealType = searchParams.get('dealType') || '';
    const store = searchParams.get('store') || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [dealsRes, dealTypesRes, storesRes] = await Promise.all([
                    getDeals(dealType, store, page, {
                        limit: 10,
                    }),
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
    }, [dealType, store, page]);

    const handleDealClick = (deal: DealFull) => {
        if (deal.status === 'pending' || deal.status === 'rejected') {
            setSelectedDeal(deal);
            setOpenDialog(true);
            return;
        }

        router.push(`/deals/deal-detail/${deal.slug}-${deal._id}`);
    };

    if (loading) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <Link
                    href="/my-store/deal/add"
                    prefetch={false}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Add Deal
                </Link>

                <DealsFilters dealTypes={dealTypes} stores={stores} />
            </div>

            <div className="bg-white border border-gray-100 shadow-xs overflow-x-auto">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Product</TableHead>
                            <TableHead className="hidden md:table-cell md:w-37.5 font-bold">Deal Type</TableHead>
                            <TableHead className="hidden md:table-cell md:w-37.5 font-bold">Store</TableHead>
                            <TableHead className="hidden md:table-cell md:w-45.5 font-bold">Price</TableHead>
                            <TableHead className="md:w-25 font-bold">Status</TableHead>
                            <TableHead className="md:w-20 text-right font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dealListResponse?.data.map((deal) => (
                            <TableRow key={deal._id}>
                                <TableCell className="flex items-center gap-3">
                                    <Image
                                        src={deal.image}
                                        alt={deal.shortDescription}
                                        width={48}
                                        height={48}
                                        className="w-7 h-7 md:w-14 md:h-14 object-cover rounded-md"
                                    />
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto font-bold text-left whitespace-normal line-clamp-2"
                                        onClick={() => handleDealClick(deal)}
                                    >
                                        {deal.shortDescription}
                                    </Button>
                                </TableCell>

                                <TableCell className="hidden md:table-cell">
                                    {deal.dealType?.map((type: any) => type.name).join(', ') || '-'}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-red-500 font-semibold">
                                    {deal.store.name}
                                </TableCell>

                                <TableCell className="hidden md:table-cell">
                                    <DealPrice
                                        originalPrice={deal.originalPrice}
                                        discountPrice={deal.discountPrice}
                                        percentageOff={deal.percentageOff}
                                        size="sm"
                                    />
                                </TableCell>

                                <TableCell>
                                    <DealStatusBadge status={deal.status} />
                                </TableCell>

                                <TableCell className="text-right space-x-3">
                                    <Link
                                        href={`/my-store/deal/${deal._id}`}
                                        prefetch={false}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {dealListResponse?.pagination && (
                <div className="flex justify-between items-center mt-4 p-4 border-t">
                    <button
                        disabled={!dealListResponse?.pagination.hasPrevPage}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm">
                        Page {dealListResponse?.pagination.currentPage} /
                        <span className="font-bold ml-1">{dealListResponse?.pagination.totalPages}</span>
                    </span>

                    <button
                        disabled={!dealListResponse?.pagination.hasNextPage}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            <DealStatusDialog deal={selectedDeal} open={openDialog} onOpenChange={setOpenDialog} />
        </>
    );
}
