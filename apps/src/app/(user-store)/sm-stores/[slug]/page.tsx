import { DealsFilters, DealsListing } from '@/features/public/deals';
import StoreHeader from '@/features/public/sm-stores/StoreHeader';
import { getActiveDeals, getDealTypes, getStores, getUserStoreById } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { SITE } from '@/utils/site';
import { getIdFromSlug } from '@/utils/utils';
import { Gem, Home, Store } from 'lucide-react';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;

    const userStoreId = getIdFromSlug(slug);

    const res = await getUserStoreById(userStoreId);

    if (res?.success) {
        return {
            title: `${res.data.name} | SavesMoney`,
            alternates: {
                canonical: `${SITE.url}/sm-stores/${slug}`,
            },
        };
    }

    return {
        title: 'Deal Type | SavesMoney',
        alternates: {
            canonical: `${SITE.url}/sm-stores/${slug}`,
        },
    };
}

const Page = async ({ params, searchParams }: Props) => {
    const { slug } = await params;

    const sp = searchParams ? await searchParams : {};

    const userStoreId = getIdFromSlug(slug);

    const initialDealType = typeof sp?.dealType === 'string' ? sp.dealType : '';
    const initialStore = typeof sp?.store === 'string' ? sp.store : '';
    const pageNum = typeof sp.page === 'string' ? parseInt(sp.page) : 1;

    const { success, data: userStore } = await getUserStoreById(userStoreId);

    if (!success) {
        notFound();
    }

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(initialDealType, initialStore, pageNum, {
            userStore: userStoreId,
        }),
        getDealTypes(),
        getStores(),
    ]);

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-2" />,
        },
        {
            label: 'SM Stores',
            href: '/sm-stores',
            icon: <Gem className="w-4 h-4 mr-2" />,
        },
        {
            label: userStore?.name ?? 'Deals',
            icon: <Store className="w-4 h-4 mr-2" />,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen">
            <div className="px-3 pt-6 pb-10">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs mb-3 md:mb-6">
                    <Breadcrumb items={breadcrumbItems} />

                    <DealsFilters dealTypes={dealTypes} stores={stores} />
                </div>

                <StoreHeader logo={userStore.logo} name={userStore.name} description={userStore.description} />

                <DealsListing
                    initDealListResponse={dealListResponse}
                    dealTypeName={userStore.name}
                    dealTypeSlug={userStore.slug}
                />
            </div>
        </div>
    );
};

export default Page;
