import { DealPrice, DealPurchaseLink } from '@/features/common';
import CommentSection from '@/features/public/comments/CommentSection';
import { DealStats, RelatedDeals, ValidityVote } from '@/features/public/deal';
import { ImageWithFallback } from '@/features/public/deal/components';
import { DealDetailSchema } from '@/features/public/deal/seo';
import { Sidebar } from '@/features/public/layout';
import { getDealById } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { Ads } from '@/shared/components/widgets';
import { Button } from '@/shared/shadecn/ui/button';
import { DealFull } from '@/shared/types';
import { getDaysRemaining, getDealLabel, getDealLabelClasses, truncateDescription } from '@/utils/deal';
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

    const label = getDealLabel(deal.coupon, deal.clearance, daysRemaining);

    const labelClasses = getDealLabelClasses(deal.coupon, deal.clearance, daysRemaining);

    return (
        <>
            <DealDetailSchema deal={deal} />
            <div className="container mx-auto pb-10">
                <div className="px-4 py-3 text-gray-600">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="py-3 grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-7">
                    <div className="xl:col-span-4 lg:col-span-5 px-3 md:px-4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="grid md:grid-cols-6 md:gap-6 p-3 pb-4 md:p-6">
                                <div className="relative md:col-span-2">
                                    <DealPurchaseLink dealId={deal._id} href={deal.purchaseLink}>
                                        <ImageWithFallback
                                            src={deal.image?.replace(/_resized(?=\.)/, '')}
                                            fallback={deal.image}
                                            alt={deal.shortDescription}
                                            className="w-full h-200 object-cover"
                                        />
                                    </DealPurchaseLink>

                                    {label && (
                                        <div
                                            className={`absolute top-0 right-0 inline-flex items-center px-3 py-1 rounded-sm text-[11px] font-semibold ${labelClasses}`}
                                        >
                                            {label}
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-4">
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

                                    <h1 className="text-base md:text-xl font-semibold mb-4">
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

                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-5">
                                        <Button
                                            asChild
                                            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full md:px-8 md:py-6 text-base font-semibold"
                                        >
                                            <DealPurchaseLink
                                                dealId={deal._id}
                                                href={deal.purchaseLink}
                                                className="text-sm md:text-base"
                                            >
                                                Get Deal at {deal.store && deal.store.name}
                                            </DealPurchaseLink>
                                        </Button>

                                        <ValidityVote dealId={deal._id} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 md:mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-3 md:px-6">
                                <div className="flex gap-6 font-semibold mt-3 md:mt-4">
                                    <button className="text-base border-b-2 border-black pb-2">Product Details</button>
                                </div>

                                <div className="py-6">
                                    <div className="product-details prose max-w-none text-sm leading-6 text-gray-800">
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
                                        <h3 className="text-base md:text-lg">Summary features:</h3>
                                        <div
                                            className="deal-description"
                                            dangerouslySetInnerHTML={{ __html: deal.description }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="my-4">
                            <Ads slot="2176866845" />
                        </div>

                        <CommentSection dealId={deal._id} />

                        <div className="mt-6">
                            <RelatedDeals dealId={deal._id} storeName={deal.store.name} storeId={deal.store._id} />
                        </div>
                    </div>

                    <Sidebar />
                </div>
            </div>
        </>
    );
};

export default Page;
