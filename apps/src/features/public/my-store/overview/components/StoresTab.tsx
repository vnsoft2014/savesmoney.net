'use client';

import { Loading } from '@/shared/components/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';
import { useEffect, useState } from 'react';
import { getTopStores } from '../../services/overview.services';

export default function StoresTab() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTopStores();
                setStores(res);
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
                        <TableHead className="font-bold">Store</TableHead>
                        <TableHead className="text-center font-bold">Total Deals</TableHead>
                        <TableHead className="text-center font-bold">Views</TableHead>
                        <TableHead className="text-center font-bold">Likes</TableHead>
                        <TableHead className="text-center font-bold">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stores?.map((store: any) => (
                        <TableRow key={store.storeId}>
                            <TableCell className="font-medium">
                                <span className="p-0 h-auto font-bold text-left text-primary whitespace-normal line-clamp-2">
                                    {store.name}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">{store.totalDeals}</TableCell>
                            <TableCell className="text-center">{store.totalViews}</TableCell>
                            <TableCell className="text-center">{store.totalLikes}</TableCell>
                            <TableCell className="text-center font-semibold">{store.score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
