'use client';

import { DealLabel } from '@/features/common/deal/components';
import { FlashDealCountdown } from '@/features/public/deal-detail';
import { ImageWithFallback } from '@/features/public/deal-detail/components';
import { DealPrice } from '@/features/public/deals/components';
import { getDaysRemaining } from '@/lib/deal';
import { DealFull } from '@/types';
import { memo } from 'react';
import { IoFlame } from 'react-icons/io5';
import DealStatusBadge from './DealStatusBadge';

interface DealCardProps {
    deal: DealFull;
    onDealClick: (deal: DealFull) => void;
}

const DealCard = memo(({ deal, onDealClick }: DealCardProps) => {
    const daysRemaining = getDaysRemaining(deal.expireAt);

    return (
        <article
            onClick={() => onDealClick(deal)}
            className="block cursor-pointer bg-white border border-gray-100 shadow-xs hover:shadow-md transition"
        >
            <div className="relative w-full aspect-square px-2 pt-2 overflow-hidden">
                <ImageWithFallback src={deal.image} alt={deal.shortDescription} />

                <DealLabel
                    flashDeal={deal.flashDeal}
                    coupon={deal.coupon}
                    clearance={deal.clearance}
                    daysRemaining={daysRemaining}
                />

                <div className="absolute bottom-0 left-0 right-0">
                    {deal.flashDeal && deal.expireAt && (
                        <div className="py-1 bg-orange-600">
                            <div className="flex justify-center items-center gap-1 text-sm md:text-base text-white font-sans-condensed font-bold">
                                <span className="hidden md:inline-block mr-1">Ends in</span>
                                <IoFlame className="inline-block md:hidden w-4 h-4 text-white mr-1" />

                                <FlashDealCountdown expireAt={deal.expireAt} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 pl-2 md:px-4 py-4">
                <h3 className="mb-1 text-gray-800 line-clamp-2 text-sm md:text-base font-bold hover:text-red-600 transition-colors">
                    {deal.shortDescription}
                </h3>

                <div className="flex justify-between items-center">
                    <DealPrice
                        originalPrice={deal.originalPrice}
                        discountPrice={deal.discountPrice}
                        percentageOff={deal.percentageOff}
                    />

                    <DealStatusBadge status={deal.status} />
                </div>
            </div>
        </article>
    );
});

DealCard.displayName = 'DealCard';

export default DealCard;
