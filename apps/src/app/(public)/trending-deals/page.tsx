import { DealsFilters, DealsListing } from '@/features/public/deals';
import { getActiveDeals, getDealTypes, getStores } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { SITE } from '@/utils/site';
import { FileText, Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Trending Deals | ${SITE.name}`,
};

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async (props: Props) => {
    const searchParams = await props.searchParams;

    const initialDealType = typeof searchParams?.dealType === 'string' ? searchParams.dealType : '';
    const initialStore = typeof searchParams?.store === 'string' ? searchParams.store : '';
    const pageNum = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(initialDealType, initialStore, pageNum, {
            hotTrend: true,
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
            label: 'Trending Deals',
            icon: <FileText className="w-4 h-4 mr-2" />,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen pb-6">
            <div className="px-3 pt-6 pb-10">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs mb-3 md:mb-6">
                    <Breadcrumb items={breadcrumbItems} />

                    <DealsFilters dealTypes={dealTypes} stores={stores} />
                </div>

                <DealsListing
                    initDealListResponse={dealListResponse}
                    params={{
                        hotTrend: true,
                    }}
                    dealTypeName="Trending Deals"
                    dealTypeSlug="trending-deals"
                />
            </div>
        </div>
    );
};

export default Page;
