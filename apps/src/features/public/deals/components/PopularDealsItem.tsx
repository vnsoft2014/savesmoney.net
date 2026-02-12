'use client';

import Link from 'next/link';

import { getDaysRemaining } from '@/utils/deal';

import { DealLabel } from '@/features/common/deal/components';
import { DealFull } from '@/shared/types';
import Image from 'next/image';
import { FlashDealCountdown } from '../../deal-detail';
import DealPrice from './DealPrice';

interface PopularDealsItemProps {
    deal: DealFull;
}

const PopularDealsItem = ({ deal }: PopularDealsItemProps) => {
    const daysRemaining = getDaysRemaining(deal.expireAt);

    const dealUrl = `/deals/deal-detail/${deal.slug}-${deal._id}`;

    return (
        <article className="flex font-sans-condensed bg-white border border-gray-200">
            {deal.image && (
                <div className="relative w-29 bg-gray-100">
                    <Image src={deal.image} alt={deal.shortDescription} fill className="object-cover" loading="lazy" />
                    <DealLabel
                        flashDeal={deal.flashDeal}
                        coupon={deal.coupon}
                        clearance={deal.clearance}
                        daysRemaining={daysRemaining}
                    />
                </div>
            )}

            <div className="flex-1 p-2">
                <Link
                    href={dealUrl}
                    className="min-h-10 mb-1 text-gray-800 line-clamp-2 text-sm font-semibold hover:text-orange-600 transition-colors"
                >
                    {deal.shortDescription}
                </Link>

                <div className="flex">
                    <DealPrice
                        originalPrice={deal.originalPrice}
                        discountPrice={deal.discountPrice}
                        percentageOff={deal.percentageOff}
                        size="xs"
                    />
                </div>

                {deal.flashDeal && deal.expireAt && (
                    <div className="py-1">
                        <div className="inline-flex items-center gap-1 px-2 text-[13px] text-white rounded-full bg-orange-600 font-sans font-bold">
                            <FlashDealCountdown expireAt={deal.expireAt} />
                        </div>
                    </div>
                )}

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
