'use client';

import { DealLabel } from '@/features/common/deal/components';
import { DealFull } from '@/shared/types';
import { getDaysRemaining } from '@/utils/deal';
import Link from 'next/link';
import { memo } from 'react';
import { IoFlame } from 'react-icons/io5';
import { FlashDealCountdown } from '../../deal-detail';
import { ImageWithFallback } from '../../deal-detail/components';
import DealPrice from './DealPrice';

interface DealCardProps {
    deal: DealFull;
}

const DealCard = memo(({ deal }: DealCardProps) => {
    const daysRemaining = getDaysRemaining(deal.expireAt);

    const dealUrl = `/deals/deal-detail/${deal.slug}-${deal._id}`;

    return (
        <article className="block bg-white border border-gray-100 shadow-xs">
            <div className="relative w-full aspect-square px-2 pt-2 overflow-hidden">
                <Link href={dealUrl} prefetch={false}>
                    <ImageWithFallback src={deal.image} alt={deal.shortDescription} />
                </Link>
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
                <Link
                    href={dealUrl}
                    prefetch={false}
                    className="mb-1 md:mb-2 text-gray-800 line-clamp-2 md:line-clamp-2 text-sm md:text-base font-bold hover:text-red-600 transition-colors"
                >
                    {deal.shortDescription}
                </Link>

                <DealPrice
                    originalPrice={deal.originalPrice}
                    discountPrice={deal.discountPrice}
                    percentageOff={deal.percentageOff}
                />
            </div>

            {deal.purchaseLink && (
            <div className="block">
              <Link
                href={deal.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-24 flex justify-center items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Buy Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>

      
            </div>
          )}
        </article>
    );
});

DealCard.displayName = 'DealCard';

export default DealCard;
