'use client';

import { getOverviewStats } from '@/services/user-store';
import { Card } from '@/shared/shadecn/ui/card';
import { ArrowUpRight, Eye, Flame, Heart, MousePointerClick } from 'lucide-react';
import useSWR from 'swr';

export default function StatsCards() {
    const { data: stats, error, isLoading } = useSWR('user-overview-stats', getOverviewStats);

    if (isLoading) {
        return <p className="py-6">Loading...</p>;
    }

    if (error) {
        return <p className="py-6 text-red-500">Failed to load data</p>;
    }

    const conversionRate =
        stats.totalViews > 0 ? ((stats.totalPurchaseClicks / stats.totalViews) * 100).toFixed(1) : '0';

    const items = [
        {
            label: 'Total Deals',
            value: stats.totalDeals,
            icon: Flame,
        },
        {
            label: 'Total Views',
            value: stats.totalViews,
            icon: Eye,
        },
        {
            label: 'Total Likes',
            value: stats.totalLikes,
            icon: Heart,
        },
        {
            label: 'Purchase Clicks',
            value: stats.totalPurchaseClicks,
            icon: MousePointerClick,
            trend: conversionRate,
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
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
    );
}
