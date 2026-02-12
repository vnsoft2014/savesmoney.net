import { DealsFilters, DealsListing } from '@/features/public/deals';
import { getActiveDeals, getDealTypes, getStoreById, getStores } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { Store } from '@/shared/types';
import { getIdFromSlug } from '@/utils/utils';
import { FileText, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{
        slug: string;
    }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug: store } = await params;

    const storeId = getIdFromSlug(store);

    const data = await getStoreById(storeId);

    if (data?.success) {
        return {
            title: `${data.data.name} | SavesMoney`,
        };
    }

    return {
        title: 'Deal Type | SavesMoney',
    };
}

const Page = async ({ params, searchParams }: Props) => {
    const { slug: store } = await params;

    const sp = searchParams ? await searchParams : {};

    const storeId = getIdFromSlug(store);

    const initialDealType = typeof sp.dealType === 'string' ? sp.dealType : '';
    const pageNum = typeof sp.page === 'string' ? parseInt(sp.page) : 1;

    if (!storeId) {
        notFound();
    }

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(initialDealType, storeId, pageNum),
        getDealTypes(),
        getStores(),
    ]);

    const currentStore = stores.find((item: Store) => item._id === storeId);

    if (!currentStore) {
        notFound();
    }

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-2" />,
        },
        {
            label: currentStore?.name ?? 'Deals',
            icon: <FileText className="w-4 h-4 mr-2" />,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen">
            <div className="px-3 pt-6 pb-10">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs mb-3 md:mb-6">
                    <Breadcrumb items={breadcrumbItems} />

                    <DealsFilters dealTypes={dealTypes} stores={[]} />
                </div>

                <DealsListing
                    initDealListResponse={dealListResponse}
                    dealTypeName={currentStore.name}
                    dealTypeSlug={currentStore.slug}
                    params={{}}
                />
            </div>
        </div>
    );
};

export default Page;
