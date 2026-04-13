'use client';

import { Loading } from '@/components/common';
import { Card } from '@/shared/shadecn/ui/card';
import { ArrowUpRight, Eye, Flame, Heart, MousePointerClick } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getOverviewStats } from '../../services/overview.services';

export default function StatsSection() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getOverviewStats();
                setStats(res);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading)
        return (
            <div className="px-3 py-10">
                <Loading />
            </div>
        );
    if (!stats) return null;

    const conversionRate =
        stats.totalViews > 0 ? ((stats.totalPurchaseClicks / stats.totalViews) * 100).toFixed(1) : '0';

    const statsItems = [
        { label: 'Total Deals', value: stats.totalDeals, icon: Flame },
        { label: 'Total Views', value: stats.totalViews, icon: Eye },
        { label: 'Total Likes', value: stats.totalLikes, icon: Heart },
        {
            label: 'Purchase Clicks',
            value: stats.totalPurchaseClicks,
            icon: MousePointerClick,
            trend: conversionRate,
        },
    ];

    return (
        <div className="grid gap-2 lg:gap-4 grid-cols-2 lg:grid-cols-4">
            {statsItems.map((item) => (
                <Card
                    key={item.label}
                    className="p-3 md:p-5 flex items-center justify-between border border-gray-100 shadow-xs"
                >
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <item.icon className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="mb-2! md:mb-4! text-sm text-muted-foreground">{item.label}</p>
                            <div className="flex items-center justify-between">
                                <h3 className="mb-0! text-xl font-semibold">{item.value.toLocaleString()}</h3>

                                {item.trend && (
                                    <div className="flex md:hidden items-center text-sm font-medium text-emerald-600">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        {item.trend}%
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {item.trend && (
                        <div className="hidden md:flex items-center text-sm font-medium text-emerald-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {item.trend}%
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
