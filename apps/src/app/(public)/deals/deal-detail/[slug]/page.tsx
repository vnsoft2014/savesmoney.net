import { DealLabel } from '@/features/common/deal/components';
import CommentSection from '@/features/public/comments/CommentSection';
import {
    CouponCodeBox,
    DealStats,
    FlashDealCountdown,
    RelatedDeals,
    ValidityVote,
} from '@/features/public/deal-detail';
import { ImageWithFallback } from '@/features/public/deal-detail/components';
import { DealDetailSchema } from '@/features/public/deal-detail/seo';
import { DealPrice, DealPurchaseLink } from '@/features/public/deals/components';
import { Sidebar } from '@/features/public/layout';
import { getDealById } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { Ads } from '@/shared/components/widgets';
import { Button } from '@/shared/shadecn/ui/button';
import { DealFull } from '@/shared/types';
import { getDaysRemaining, truncateDescription } from '@/utils/deal';
import { formatDate, getIdFromSlug, stripHtmlTags } from '@/utils/utils';
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

    const deal: DealFull = await getDealById(dealId, true);

    if (deal) {
        const description = truncateDescription(stripHtmlTags(deal.description), 160);

        return {
            title: `${deal.shortDescription} | SavesMoney`,
            description,
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
    };
}

const Page = async ({ params }: Props) => {
    const { slug } = await params;

    const dealId = getIdFromSlug(slug);

    const deal: DealFull = await getDealById(dealId, true);

    if (!deal) {
        notFound();
    }

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

    return (
        <>
            <DealDetailSchema deal={deal} />
            <div className="container mx-auto pb-10">
                <div className="px-4 py-3 text-gray-600">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="py-3 grid grid-cols-1 xl:grid-cols-8 lg:grid-cols-7">
                    <div className="xl:col-span-6 lg:col-span-5 px-3 md:px-4">
                        <div className="bg-white border">
                            <div className="flex flex-col md:flex-row items-start">
                                <div className="relative w-full xl:w-110 lg:w-90 md:w-70">
                                    <DealPurchaseLink dealId={deal._id} href={deal.purchaseLink}>
                                        <ImageWithFallback
                                            src={deal.image?.replace(/_resized(?=\.)/, '')}
                                            fallback={deal.image}
                                            alt={deal.shortDescription}
                                            className="w-full object-cover"
                                        />
                                    </DealPurchaseLink>

                                    <DealLabel
                                        flashDeal={deal.flashDeal}
                                        coupon={deal.coupon}
                                        clearance={deal.clearance}
                                        daysRemaining={daysRemaining}
                                    />

                                    <div className="absolute bottom-0 left-0 right-0">
                                        {deal.flashDeal && deal.expireAt && (
                                            <div className="py-1 bg-orange-600">
                                                <div className="flex justify-center items-center gap-2 text-base md:text-lg text-white font-sans-condensed font-bold">
                                                    <span className="inline-block">Ends in</span>
                                                    <FlashDealCountdown expireAt={deal.expireAt} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-4 p-3 md:p-4">
                                    <div className="flex items-center gap-2 mb-2 text-sm">
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

                                    <h1 className="text-base md:text-xl mb-4 font-sans-condensed font-bold">
                                        <DealPurchaseLink dealId={deal._id} href={deal.purchaseLink}>
                                            {deal.shortDescription}
                                        </DealPurchaseLink>
                                    </h1>

                                    <DealPrice
                                        originalPrice={deal.originalPrice}
                                        discountPrice={deal.discountPrice}
                                        percentageOff={deal.percentageOff}
                                        size="lg"
                                    />

                                    <DealStats dealId={deal._id} />

                                    {deal.couponCode && (
                                        <div className="mt-4">
                                            <CouponCodeBox code={deal.couponCode} />
                                        </div>
                                    )}

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
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 md:mt-6 bg-white border">
                            <div className="px-3 md:px-4">
                                <div className="flex gap-6 font-semibold mt-3 md:mt-4">
                                    <button className="border-b-2 border-black pb-2 text-lg md:text-xl font-sans-condensed font-bold">
                                        Product Details
                                    </button>
                                </div>

                                <div className="py-6">
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
                                        <p>
                                            For more details, please click on{' '}
                                            <DealPurchaseLink
                                                dealId={deal._id}
                                                href={deal.purchaseLink}
                                                className="text-orange-600 underline"
                                            >
                                                this link
                                            </DealPurchaseLink>
                                            .
                                        </p>
                                        <h3 className="text-lg md:text-xl font-sans-condensed font-bold">
                                            Summary features:
                                        </h3>
                                        <div
                                            className="deal-description"
                                            dangerouslySetInnerHTML={{ __html: deal.description }}
                                        />
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

                    <Sidebar />
                </div>
            </div>
        </>
    );
};

export default Page;
