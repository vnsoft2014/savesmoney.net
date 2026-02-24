'use client';

import { Skeleton } from '@/shared/shadecn/ui/skeleton';

interface Props {
    storeName: string;
}

export default function RelatedDealsSkeleton({ storeName }: Props) {
    return (
        <div className="pt-3 pb-0 md:py-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-bold">More Deals From {storeName}</h3>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="w-7 h-7 rounded-full" />
                </div>
            </div>

            {/* Slider Skeleton */}
            <div className="mt-3 overflow-hidden">
                <div className="flex gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="
                                shrink-0
                                w-full
                                md:w-[calc((100%-2rem)/3)]
                                xl:w-[calc((100%-3rem)/4)]
                            "
                        >
                            <div className="bg-white border border-gray-100 shadow-xs p-4 space-y-3">
                                <Skeleton className="w-full aspect-square" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
