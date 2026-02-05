'use client';

import { DealData } from '@/types';
import Link from 'next/link';

import { getDaysRemaining, getDealLabel, getDealLabelClasses } from '@/utils/deal';

import { cn } from '@/lib/utils';
import DealPrice from './DealPrice';

interface PopularDealsItemProps {
    deal: DealData;
}

const PopularDealsItem = ({ deal }: PopularDealsItemProps) => {
    const daysRemaining = getDaysRemaining(deal.expireAt);
    const label = getDealLabel(deal.coupon, deal.clearance, daysRemaining);
    const labelClasses = getDealLabelClasses(deal.coupon, deal.clearance, daysRemaining);

    const dealUrl = `/deals/deal-detail/${deal.slug}-${deal._id}`;

    return (
        <article className="flex p-2 bg-white rounded-sm overflow-hidden shadow">
            {deal.image && (
                <div className="relative flex w-20 h-full items-center overflow-hidden">
                    <div className="relative w-full">
                        <img
                            src={deal.image}
                            alt={deal.shortDescription}
                            className="w-full h-24 object-cover"
                            loading="lazy"
                            width={210}
                            height={210}
                        />
                        {label && (
                            <span
                                className={cn(
                                    'absolute top-0 right-0 inline-flex items-center px-1 py-0 rounded-sm text-[10px] font-semibold',
                                    labelClasses,
                                )}
                                aria-label={label}
                            >
                                {label}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 pl-2">
                <Link
                    href={dealUrl}
                    className="min-h-10 mb-1 text-gray-800 line-clamp-2 text-sm font-semibold hover:text-orange-600 transition-colors"
                >
                    {deal.shortDescription}
                </Link>

                <DealPrice
                    originalPrice={deal.originalPrice}
                    discountPrice={deal.discountPrice}
                    percentageOff={deal.percentageOff}
                    size="xs"
                />

                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                        {deal.store && <span className="py-1 text-[11px] text-gray-400">{deal.store.name}</span>}
                    </div>

                    {deal.purchaseLink && (
                        <div className="block">
                            <a
                                href={deal.purchaseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                            >
                                Buy Now
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default PopularDealsItem;
