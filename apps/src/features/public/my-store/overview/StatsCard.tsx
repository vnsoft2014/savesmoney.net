'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
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
            label: 'Tổng Deals',
            value: stats.totalDeals,
            icon: Flame,
            color: 'text-orange-600',
            description: `${stats.hotDeals} đang cực hot`,
            badgeColor: 'bg-orange-100 text-orange-700',
        },
        {
            label: 'Lượt Xem',
            value: stats.totalViews,
            icon: Eye,
            color: 'text-blue-600',
            description: 'Tổng tương tác hiển thị',
            badgeColor: 'bg-blue-100 text-blue-700',
        },
        {
            label: 'Yêu Thích',
            value: stats.totalLikes,
            icon: Heart,
            color: 'text-pink-600',
            description: 'Lòng tin từ khách hàng',
            badgeColor: 'bg-pink-100 text-pink-700',
        },
        {
            label: 'Lượt Mua',
            value: stats.totalPurchaseClicks,
            icon: MousePointerClick,
            color: 'text-green-600',
            description: `Tỉ lệ chuyển đổi: ${conversionRate}%`,
            badgeColor: 'bg-green-100 text-green-700',
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {items.map((item) => (
                <Card
                    key={item.label}
                    className="relative overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300"
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            {/* Icon được bọc trong vòng tròn mềm mại */}
                            <div className={cn('p-2.5 rounded-lg', item.badgeColor.split(' ')[0])}>
                                <item.icon className={cn('h-5 w-5', item.color)} />
                            </div>

                            {/* Badge nhỏ xinh như trong ảnh */}
                            <span
                                className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded', item.badgeColor)}
                            >
                                Stats
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
                            <div className="text-3xl font-extrabold text-[#1a2b56] tracking-tight">
                                {item.value.toLocaleString()}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5">
                            {item.label === 'Lượt Mua' ? (
                                <div className="flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded text-[11px] font-medium">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {conversionRate}%
                                </div>
                            ) : null}
                            <p className="text-xs text-gray-400 font-medium">{item.description}</p>
                        </div>

                        {/* Hiệu ứng thanh màu dưới đáy card để tăng tính thẩm mỹ */}
                        <div className={cn('absolute bottom-0 left-0 h-1 w-full', item.color.replace('text', 'bg'))} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
