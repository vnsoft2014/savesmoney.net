'use client';

import { DealFull } from '@/shared/types';
import { getDaysRemaining, getDealLabel, getDealLabelClasses } from '@/utils/deal';
import Link from 'next/link';
import { memo } from 'react';
import DealPrice from './DealPrice';

interface DealCardProps {
    deal: DealFull;
}

const DealCard = memo(({ deal }: DealCardProps) => {
    const daysRemaining = getDaysRemaining(deal.expireAt);
    const label = getDealLabel(deal.coupon, deal.clearance, daysRemaining);
    const labelClasses = getDealLabelClasses(deal.coupon, deal.clearance, daysRemaining);

    const dealUrl = `/deals/deal-detail/${deal.slug}-${deal._id}`;
    const hasDealTypes = Array.isArray(deal.dealType) && deal.dealType.length > 0;

    return (
        <article className="flex md:block px-2 py-3 md:py-3 md:px-0 bg-white overflow-hidden shadow hover:shadow-lg transition-shadow">
            {deal.image && (
                <div className="relative flex w-24 h-full md:w-full md:h-auto items-center md:px-3 md:mb-4 overflow-hidden">
                    <div className="relative w-full">
                        <img
                            src={deal.image}
                            alt={deal.shortDescription}
                            className="w-full h-24 md:h-48 object-cover"
                            loading="lazy"
                            width={210}
                            height={210}
                        />
                        {label && (
                            <span
                                className={`absolute top-0 right-0 inline-flex items-center px-1 py-0 md:px-3 md:py-1 rounded-sm text-[10px] font-semibold ${labelClasses}`}
                                aria-label={label}
                            >
                                {label}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 pl-2 md:px-4">
                <Link
                    href={dealUrl}
                    prefetch={false}
                    className="min-h-10 md:min-h-16 mb-1 md:mb-2 text-gray-800 line-clamp-2 md:line-clamp-3 text-sm font-semibold hover:text-orange-600 transition-colors"
                >
                    {deal.shortDescription}
                </Link>

                <DealPrice
                    originalPrice={deal.originalPrice}
                    discountPrice={deal.discountPrice}
                    percentageOff={deal.percentageOff}
                />

                {/* <div className="flex justify-between items-center mt-3 md:mt-2 md:mb-2">
                    {deal.store && (
                        <span className="hidden md:inline-block py-1 text-[11px] md:text-xs text-gray-400">
                            {deal.store.name}
                        </span>
                    )}

                    <div className="flex items-center gap-2 md:gap-1">
                        {deal.store && (
                            <span className="md:hidden py-1 text-[11px] md:text-xs text-gray-400">
                                {deal.store.name}
                            </span>
                        )}
                        {hasDealTypes ? (
                            deal.dealType.slice(0, 1).map((type: any) => (
                                <Link
                                    key={type._id}
                                    href={`/deals/${type.slug}-${type._id}`}
                                    className="px-2 py-1 text-[11px] md:text-xs font-semibold rounded-full 
                            bg-orange-100 text-orange-600 hover:bg-orange-100 transition"
                                >
                                    {type.name}
                                </Link>
                            ))
                        ) : (
                            <span className="text-[11px] md:text-xs text-gray-400">No type</span>
                        )}
                    </div>

                    {deal.purchaseLink && (
                        <div className="block md:hidden">
                            <DealPurchaseLink
                                dealId={deal._id}
                                href={deal.purchaseLink}
                                className="flex justify-center items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                            >
                                Buy Now
                            </DealPurchaseLink>
                        </div>
                    )}
                </div>

                {deal.purchaseLink && (
                    <div className="hidden md:block pt-2 md:pt-3 md:border-t border-gray-200">
                        <DealPurchaseLink
                            dealId={deal._id}
                            href={deal.purchaseLink}
                            className="md:flex justify-center items-center px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            Buy Now
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-2"
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
                        </DealPurchaseLink>
                    </div>
                )}*/}
            </div>
        </article>
    );
});

DealCard.displayName = 'DealCard';

export default DealCard;
