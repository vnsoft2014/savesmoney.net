'use client';

import { Skeleton } from '@/shared/shadecn/ui/skeleton';

export default function PopularDealsSkeleton() {
    return (
        <div className="space-y-4 mt-4">
            {Array.from({ length: 10 }).map((_, index) => (
                <article key={index} className="flex bg-white border border-gray-100 shadow-xs">
                    {/* Image */}
                    <Skeleton className="w-29 h-29 rounded-none" />

                    <div className="flex-1 p-2 space-y-2">
                        {/* Title */}
                        <Skeleton className="h-4 w-full" />

                        {/* Price */}
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                        </div>

                        {/* Countdown */}
                        <Skeleton className="h-5 w-24 rounded-full" />

                        {/* Bottom row */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-16 rounded-lg" />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
