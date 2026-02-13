'use client';

import StatsCards from '@/features/public/my-store/overview/StatsCard';
import { getDeals } from '@/services/user-store';
import { Loading } from '@/shared/components/common';
import { Badge } from '@/shared/shadecn/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';
import { DealFull, UserStore } from '@/shared/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { DealPrice } from '../../deals/components';

type Props = {
    store: UserStore;
};

export default function Overview({ store }: Props) {
    const [page, setPage] = useState(1);

    const fetcher = async () => {
        const res = await getDeals('', '', page);
        return res;
    };

    const { data, error, isLoading } = useSWR(['user-deals', page], fetcher);

    const dealList = data?.data as DealFull[];
    const pagination = data?.pagination;

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-8">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-8">
                <p className="text-red-500">Failed to load deals</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-6 lg:mt-10 px-3 space-y-8 bg-slate-50/50">
            <StatsCards />

            <div className="flex justify-between items-center">
                <h2 className="mb-0! text-xl lg:text-2xl font-sans-condensed font-bold">Deal Management</h2>
                {store.isActive}
            </div>

            <div className="bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Deal Type</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {dealList?.map((deal) => (
                                <TableRow key={deal._id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Image
                                            src={deal.image}
                                            alt={deal.shortDescription}
                                            width={48}
                                            height={48}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />
                                        <Link
                                            href={`/deals/deal-detail/${deal.slug}-${deal._id}`}
                                            className="line-clamp-1 font-bold whitespace-nowrap hover:text-gray-700 transition-colors"
                                            prefetch={false}
                                        >
                                            {deal.shortDescription}
                                        </Link>
                                    </TableCell>

                                    <TableCell>
                                        {deal.dealType?.map((type: any) => type.name).join(', ') || '-'}
                                    </TableCell>

                                    <TableCell className="text-red-500 font-semibold">{deal.store.name}</TableCell>

                                    <TableCell>
                                        <DealPrice
                                            originalPrice={deal.originalPrice}
                                            discountPrice={deal.discountPrice}
                                            percentageOff={deal.percentageOff}
                                            size="sm"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {deal.status === 'published' && (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                Published
                                            </Badge>
                                        )}

                                        {deal.status === 'pending' && (
                                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                                Pending
                                            </Badge>
                                        )}

                                        {deal.status === 'rejected' && (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
                                        )}
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

                    {pagination && (
                        <div className="flex justify-between items-center p-4 border-t">
                            <button
                                disabled={!pagination.hasPrevPage}
                                onClick={() => setPage((prev) => prev - 1)}
                                className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span className="text-sm">
                                Page {pagination.currentPage} /{' '}
                                <span className="font-bold">{pagination.totalPages}</span>
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
            </div>
        </div>
    );
}
