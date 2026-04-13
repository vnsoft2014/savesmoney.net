'use client';

import { Loading } from '@/components/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTopDeals } from '../../services/overview.services';

export default function TopDealsTab() {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTopDeals();
                setDeals(res);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="bg-white border border-gray-100 shadow-xs">
            <Table className="table-fixed w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-55 md:w-87.5 font-bold">Product</TableHead>
                        <TableHead className="text-center md:w-37.5 font-bold">Views</TableHead>
                        <TableHead className="text-center md:w-37.5 font-bold">Likes</TableHead>
                        <TableHead className="text-center md:w-37.5 font-bold">Clicks</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deals?.map((item: any) => (
                        <TableRow key={item.deal._id}>
                            <TableCell className="flex items-center gap-3">
                                <Image
                                    src={item.deal.image}
                                    alt={item.deal.shortDescription}
                                    width={48}
                                    height={48}
                                    className="w-7 h-7 md:w-14 md:h-14 object-cover rounded-md"
                                />
                                <Link
                                    href={`/deals/deal-detail/${item.deal.slug}-${item.deal._id}`}
                                    className="p-0 h-auto font-bold text-left text-primary hover:underline whitespace-normal line-clamp-2"
                                >
                                    {item.deal.shortDescription}
                                </Link>
                            </TableCell>
                            <TableCell className="text-center">{item.views}</TableCell>
                            <TableCell className="text-center">{item.likes}</TableCell>
                            <TableCell className="text-center">{item.purchaseClicks}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
