'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';
import Image from 'next/image';
import Link from 'next/link';

type Deal = {
    _id: string;
    views: number;
    likes: number;
    purchaseClicks: number;
    deal: {
        _id: string;
        shortDescription: string;
        image?: string;
        slug: string;
    };
};

export default function TopDealsTable({ deals }: { deals: Deal[] }) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deal</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Likes</TableHead>
                        <TableHead>Clicks</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deals.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell className="flex items-center gap-3">
                                {item.deal.image && (
                                    <Image src={item.deal.image} alt="" width={40} height={40} className="rounded-md" />
                                )}
                                <Link href={`/deals/deal-detail/${item.deal.slug}-${item.deal._id}`} target="_blank">
                                    <span className="line-clamp-1">{item.deal.shortDescription}</span>
                                </Link>
                            </TableCell>
                            <TableCell>{item.views}</TableCell>
                            <TableCell>{item.likes}</TableCell>
                            <TableCell>{item.purchaseClicks}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
