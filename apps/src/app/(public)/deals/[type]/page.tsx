import { DealsFilters, DealsListing } from '@/features/public/deals';
import { getActiveDeals, getDealTypeById, getDealTypes, getStores } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { DealType } from '@/shared/types';
import { getIdFromSlug } from '@/utils/utils';
import { FileText, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{
        type: string;
    }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
    const { type: dealType } = await params;

    const dealTypeId = getIdFromSlug(dealType);

    const data = await getDealTypeById(dealTypeId);

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
    const { type: dealType } = await params;

    const sp = searchParams ? await searchParams : {};

    const dealTypeId = getIdFromSlug(dealType);

    const initialStore = typeof sp.store === 'string' ? sp.store : '';
    const pageNum = typeof sp.page === 'string' ? parseInt(sp.page) : 1;

    if (!dealTypeId) {
        notFound();
    }

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(dealTypeId, initialStore, pageNum),
        getDealTypes(),
        getStores(),
    ]);

    const currentDealType = dealTypes.find((item: DealType) => item._id === dealTypeId);

    if (!currentDealType) {
        notFound();
    }

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-2" />,
        },
        {
            label: currentDealType?.name ?? 'Deals',
            icon: <FileText className="w-4 h-4 mr-2" />,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen">
            <div className="px-3 pt-6 pb-10">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs mb-3 md:mb-6">
                    <Breadcrumb items={breadcrumbItems} />

                    <DealsFilters dealTypes={[]} stores={stores} />
                </div>

                <DealsListing
                    initDealListResponse={dealListResponse}
                    dealTypeName={currentDealType.name}
                    dealTypeSlug={currentDealType.slug}
                    params={{}}
                />
            </div>
        </div>
    );
};

export default Page;
