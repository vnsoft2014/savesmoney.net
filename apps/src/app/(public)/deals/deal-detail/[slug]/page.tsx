import { Breadcrumb } from '@/components/common';
import { Ads } from '@/components/widgets';
import { SITE } from '@/config/site';
import { DealLabel } from '@/features/common/deal/components';
import CommentSection from '@/features/public/comments/CommentSection';
import {
    CouponCodeBox,
    DealAdminActions,
    DealStats,
    FlashDealCountdown,
    RelatedDeals,
    ValidityVote,
} from '@/features/public/deal-detail';
import { DealImageSlider } from '@/features/public/deal-detail/components';
import { DealDetailSchema } from '@/features/public/deal-detail/seo';
import { DealPrice, DealPurchaseLink } from '@/features/public/deals/components';
import { Sidebar } from '@/features/public/layout';
import { getDaysRemaining, truncateDescription } from '@/lib/deal';
import { stripHtml } from '@/lib/sanitize';
import { formatDate, getIdFromSlug } from '@/lib/utils';
import { getDealById } from '@/services';
import { Button } from '@/shared/shadecn/ui/button';
import { Coupon } from '@/types';
import { FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;

    const dealId = getIdFromSlug(slug);

    const { success, data } = await getDealById(dealId, true);

    const deal = data!;

    if (success) {
        const description = truncateDescription(stripHtml(deal.description), 160);

        return {
            title: `${deal.shortDescription} | SavesMoney`,
            description,
            alternates: {
                canonical: `${SITE.url}/deals/deal-detail/${slug}`,
            },
            keywords: deal.tags ?? [],
            openGraph: {
                title: `${deal.shortDescription} | SavesMoney`,
                description,
                images: [
                    {
                        url: deal.image,
                        width: 1200,
                        height: 630,
                        alt: deal.shortDescription,
                    },
                ],
                type: 'article',
            },

            twitter: {
                card: 'summary_large_image',
                title: `${deal.shortDescription} | SavesMoney`,
                description,
                images: [deal.image],
            },
        };
    }

    return {
        title: 'Deal | SavesMoney',
        alternates: {
            canonical: `${SITE.url}/deals/deal-detail/${slug}`,
        },
    };
}

const Page = async ({ params }: Props) => {
    const { slug } = await params;

    const dealId = getIdFromSlug(slug);

    const { success, data } = await getDealById(dealId, true);

    if (!success) {
        notFound();
    }

    const deal = data!;

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-1" />,
        },

        ...(Array.isArray(deal.dealType) && deal.dealType.length > 0 && deal.dealType[0]?.name
            ? [
                  {
                      label: deal.dealType[0].name,
                      href: `/deals/${deal.dealType[0].slug}-${deal.dealType[0]._id}`,
                      icon: <FileText className="w-4 h-4 mr-1" />,
                  },
              ]
            : []),

        {
            label: <span className="truncate min-w-0 max-w-48 md:max-w-md">{deal.shortDescription}</span>,
            active: true,
        },
    ];

    const daysRemaining = getDaysRemaining(deal.expireAt);
    const coupons = deal.coupons ?? [];

    return (
        <>
            <DealDetailSchema deal={deal} />
            <div className="xl:max-w-384 mx-auto pb-10">
                <div className="px-4 py-3 text-gray-600">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="py-3">
                    <div className="xl:col-span-6 lg:col-span-5 px-3">
                        <div className="p-3 bg-white border border-gray-100 shadow-xs">
                            <div className="grid grid-cols-1 md:grid-cols-5 items-start">
                                <div className="relative col-span-1 md:col-span-2">
                                    <DealImageSlider
                                        images={deal.images?.length > 0 ? deal.images : [deal.image]}
                                        alt={deal.shortDescription}
                                    />

                                    <DealLabel
                                        flashDeal={deal.flashDeal}
                                        coupon={deal.coupon}
                                        clearance={deal.clearance}
                                        daysRemaining={daysRemaining}
                                    />

                                    {/* {deal.flashDeal && deal.expireAt && ( deal.expireAt */}
                                    <div className="py-1 bg-orange-600">
                                        <div className="flex justify-center items-center gap-2 text-base md:text-lg text-white font-sans-condensed font-bold">
                                            <span className="inline-block">Ends in</span>
                                            <FlashDealCountdown expireAt={'2027-01-01'} />
                                        </div>
                                    </div>
                                    {/* )} */}
                                </div>

                                <div className="col-span-1 md:col-span-3 mt-4 md:mt-0 md:pl-4">
                                    <div className="flex items-center gap-2 mb-2 text-[11px]">
                                        <div className="flex items-center gap-1">
                                            {Array.isArray(deal.dealType) &&
                                                deal.dealType.map(
                                                    (type: any) =>
                                                        type.name && (
                                                            <Link
                                                                key={type._id}
                                                                href={`/deals/${type.slug}`}
                                                                prefetch={false}
                                                                className="bg-orange-600 hover:bg-orange-700 text-white px-1 rounded"
                                                            >
                                                                {type.name}
                                                            </Link>
                                                        ),
                                                )}
                                        </div>
                                        <span className="text-gray-500">
                                            {deal.author && deal.author.name} | Staff posted{' '}
                                            {formatDate(deal.createdAt)}
                                        </span>
                                    </div>

                                    <h1 className="text-xl md:text-2xl mb-4 font-sans-condensed font-bold">
                                        <DealPurchaseLink dealId={deal._id} href={deal.purchaseLink}>
                                            {deal.shortDescription}
                                        </DealPurchaseLink>
                                    </h1>

                                    <div className="flex items-center gap-3">
                                        <DealPrice
                                            originalPrice={deal.originalPrice}
                                            discountPrice={deal.discountPrice}
                                            percentageOff={deal.percentageOff}
                                            size="lg"
                                        />

                                        {coupons?.length > 0 && (
                                            <div>
                                                {coupons.map((coupon: Coupon, index: number) => (
                                                    <CouponCodeBox
                                                        key={index}
                                                        code={coupon.code}
                                                        comment={coupon.comment}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <DealStats dealId={deal._id} />

                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-5">
                                        <Button
                                            asChild
                                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full md:px-6 md:py-6 xl:px-8 font-semibold"
                                        >
                                            <DealPurchaseLink
                                                dealId={deal._id}
                                                href={deal.purchaseLink}
                                                className="text-base md:text-lg"
                                            >
                                                Get Deal at {deal.store && deal.store.name}
                                            </DealPurchaseLink>
                                        </Button>

                                        <ValidityVote dealId={deal._id} />
                                    </div>

                                    <DealAdminActions dealId={deal._id} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 md:mt-6 bg-white border border-gray-100 shadow-xs">
                            <div className="p-3 md:p-4">
                                <div className="flex gap-6 font-semibold">
                                    <button className="border-b-2 border-black pb-2 text-lg md:text-xl font-sans-condensed font-bold">
                                        Product Details
                                    </button>
                                </div>

                                <div className="pt-6">
                                    <div className="product-details prose max-w-none text-base leading-6 text-gray-800">
                                        <p>
                                            <DealPurchaseLink
                                                dealId={deal._id}
                                                href={deal.purchaseLink}
                                                className="underline"
                                            >
                                                <strong>{deal.store?.name}</strong>
                                            </DealPurchaseLink>{' '}
                                            has <strong>"{deal.shortDescription}"</strong> for the price of{' '}
                                            <strong>${deal.discountPrice}</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden my-4">
                            <Ads slot="2176866845" />
                        </div>

                        <CommentSection dealId={deal._id} />

                        <div className="mt-6">
                            <RelatedDeals
                                dealId={deal._id}
                                storeName={deal.store.name}
                                storeSlug={deal.store.slug}
                                storeId={deal.store._id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
