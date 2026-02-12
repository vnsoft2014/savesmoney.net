import { DealsFilters, DealsListing } from '@/features/public/deals';
import { getActiveDeals, getDealTypes, getStores } from '@/services';
import { getUserStoreById } from '@/services/user-store';
import { Breadcrumb } from '@/shared/components/common';
import { getIdFromSlug } from '@/utils/utils';
import { FileText, Home } from 'lucide-react';
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
        };
    }

    return {
        title: 'Deal Type | SavesMoney',
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

    console.log(dealListResponse);

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-2" />,
        },
        {
            label: userStore?.name ?? 'Deals',
            icon: <FileText className="w-4 h-4 mr-2" />,
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

                <DealsListing
                    initDealListResponse={dealListResponse}
                    dealTypeName={userStore.name}
                    dealTypeSlug={userStore.slug}
                    params={{}}
                />
            </div>
        </div>
    );
};

export default Page;
