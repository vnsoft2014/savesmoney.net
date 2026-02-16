'use client';

import { ArrowUpRight, Eye, Flame, Heart, MousePointerClick } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card } from '@/shared/shadecn/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadecn/ui/table';

import { Loading } from '@/shared/components/common';
import { getOverviewStats, getTopDeals, getTopStores } from '../../services/overview.services';

import { DealRaw, Store } from '@/shared/types';

type OverviewData = {
    stats: any;
    deals: DealRaw[];
    stores: Store[];
};

export default function Overview() {
    const [activeTab, setActiveTab] = useState<'deals' | 'stores'>('deals');
    const [data, setData] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setLoading(true);

                const [stats, topDeals, topStores] = await Promise.all([
                    getOverviewStats(),
                    getTopDeals(),
                    getTopStores(),
                ]);

                setData({
                    stats,
                    deals: topDeals,
                    stores: topStores,
                });
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    if (loading)
        return (
            <div className="px-3 py-10">
                <Loading />
            </div>
        );
    if (error) return <p className="text-red-500">Failed to load overview</p>;

    const conversionRate =
        data!.stats.totalViews > 0
            ? ((data!.stats.totalPurchaseClicks / data!.stats.totalViews) * 100).toFixed(1)
            : '0';

    const statsItems = [
        {
            label: 'Total Deals',
            value: data!.stats.totalDeals,
            icon: Flame,
        },
        {
            label: 'Total Views',
            value: data!.stats.totalViews,
            icon: Eye,
        },
        {
            label: 'Total Likes',
            value: data!.stats.totalLikes,
            icon: Heart,
        },
        {
            label: 'Purchase Clicks',
            value: data!.stats.totalPurchaseClicks,
            icon: MousePointerClick,
            trend: conversionRate,
        },
    ];

    return (
        <div className="container mx-auto mt-6 lg:mt-10 px-3 space-y-8 bg-slate-50/50">
            {/* ===== Stats Cards ===== */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {statsItems.map((item) => (
                    <Card key={item.label} className="p-5 flex items-center justify-between hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <item.icon className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <h2 className="text-xl font-semibold">{item.value.toLocaleString()}</h2>
                            </div>
                        </div>

                        {item.trend && (
                            <div className="flex items-center text-sm font-medium text-emerald-600">
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                {item.trend}%
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* ===== Tabs + Table ===== */}
            <div className="bg-white shadow-sm rounded-lg">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('deals')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'deals' ? 'border-b-2 border-black' : 'text-muted-foreground'
                        }`}
                    >
                        Top Deals
                    </button>

                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'stores' ? 'border-b-2 border-black' : 'text-muted-foreground'
                        }`}
                    >
                        Top Stores
                    </button>
                </div>

                <div className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {activeTab === 'deals' ? (
                                    <>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Views</TableHead>
                                        <TableHead>Likes</TableHead>
                                        <TableHead>Clicks</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead>Store</TableHead>
                                        <TableHead>Total Deals</TableHead>
                                        <TableHead>Views</TableHead>
                                        <TableHead>Likes</TableHead>
                                        <TableHead>Score</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {activeTab === 'deals' &&
                                data?.deals?.map((item: any) => (
                                    <TableRow key={item.deal._id}>
                                        <TableCell className="flex items-center gap-3">
                                            <Image
                                                src={item.deal.image}
                                                alt={item.deal.shortDescription}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover"
                                            />
                                            <Link
                                                href={`/deals/deal-detail/${item.deal.slug}-${item.deal._id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {item.deal.shortDescription}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{item.views}</TableCell>
                                        <TableCell>{item.likes}</TableCell>
                                        <TableCell>{item.purchaseClicks}</TableCell>
                                    </TableRow>
                                ))}

                            {activeTab === 'stores' &&
                                data?.stores?.map((store: any) => (
                                    <TableRow key={store.storeId}>
                                        <TableCell className="font-medium">{store.name}</TableCell>
                                        <TableCell>{store.totalDeals}</TableCell>
                                        <TableCell>{store.totalViews}</TableCell>
                                        <TableCell>{store.totalLikes}</TableCell>
                                        <TableCell className="font-semibold">{store.score}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
