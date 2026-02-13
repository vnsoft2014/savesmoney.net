'use client';

import { DealLabel } from '@/features/common/deal/components';
import { DealFull } from '@/shared/types';
import { getDaysRemaining } from '@/utils/deal';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { IoFlame } from 'react-icons/io5';
import { FlashDealCountdown } from '../../deal-detail';
import DealPrice from './DealPrice';

interface DealCardProps {
    deal: DealFull;
}

const DealCard = memo(({ deal }: DealCardProps) => {
    const daysRemaining = getDaysRemaining(deal.expireAt);

    const dealUrl = `/deals/deal-detail/${deal.slug}-${deal._id}`;

    return (
        <article className="block bg-white border">
            {deal.image && (
                <div className="relative w-full h-auto overflow-hidden">
                    <Image
                        src={deal.image}
                        alt={deal.shortDescription}
                        className="object-cover"
                        loading="lazy"
                        width={535}
                        height={535}
                    />
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
            )}

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
        </article>
    );
});

DealCard.displayName = 'DealCard';

export default DealCard;
