'use client';

import StatsCards from '@/features/public/my-store/overview/StatsCard';
import { getDeals } from '@/services/user-store';
import { Loading } from '@/shared/components/common';
import { Badge } from '@/shared/shadecn/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';
import { DealFull } from '@/shared/types';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { DealPrice } from '../../deals/components';

const fetcher = async () => {
    const res = await getDeals('', '', 1);
    return res.data as DealFull[];
};

export default function Overview() {
    const { data: dealList, error, isLoading, mutate } = useSWR('user-deals', fetcher);

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
        <div className="container mx-auto mt-6 lg:mt-10 px-3 space-y-8 bg-slate-50/50 min-h-screen">
            <StatsCards />

            <div className="flex justify-between items-center">
                <h2 className="mb-0! text-xl lg:text-2xl font-bold">Deal Management</h2>
                <Link
                    href="/my-store/deal/add"
                    className="bg-blue-600 hover:bg-blue-700 text-sm lg:text-base text-white px-4 py-2 rounded-sm shadow"
                    prefetch={false}
                >
                    + Add Deal
                </Link>
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

                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={async () => {
                                                // await deleteDeal(deal._id);
                                                // mutate();
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
