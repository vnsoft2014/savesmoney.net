'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { Eye, Flame, Heart, MousePointerClick, TrendingUp } from 'lucide-react';

type Props = {
    stats: {
        totalDeals: number;
        totalViews: number;
        totalLikes: number;
        totalPurchaseClicks: number;
        hotDeals: number;
    };
};

export default function StatsCards({ stats }: Props) {
    const conversionRate = stats.totalViews > 0 ? ((stats.totalPurchaseClicks / stats.totalViews) * 100).toFixed(1) : 0;

    const items = [
        {
            label: 'Total Deals',
            value: stats.totalDeals,
            icon: Flame,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
            description: `${stats.hotDeals} hot deals`,
        },
        {
            label: 'Total Views',
            value: stats.totalViews,
            icon: Eye,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            description: 'Total views across all deals',
        },
        {
            label: 'Total Likes',
            value: stats.totalLikes,
            icon: Heart,
            color: 'text-pink-500',
            bgColor: 'bg-pink-50',
            description: 'User engagement interactions',
        },
        {
            label: 'Purchase Clicks',
            value: stats.totalPurchaseClicks,
            icon: MousePointerClick,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            description: `Conversion rate: ${conversionRate}%`,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <Card
                    key={item.label}
                    className="p-4 overflow-hidden border-none shadow-sm transition-all hover:shadow-md"
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                        <div className={cn('p-2 rounded-xl', item.bgColor)}>
                            <item.icon className={cn('h-4 w-4', item.color)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight">{item.value.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {item.label === 'Purchase Clicks' && <TrendingUp className="h-3 w-3 text-green-500" />}
                            {item.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
