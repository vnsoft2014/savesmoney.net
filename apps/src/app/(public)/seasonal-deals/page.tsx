import { DealsListing } from '@/features/public/deals';
import { DealsFilters } from '@/features/public/deals/filters';
import { Sidebar } from '@/features/public/layout';
import { getActiveDeals, getDealTypes, getStores } from '@/services';
import { Breadcrumb } from '@/shared/components/common';
import { SITE } from '@/utils/site';
import { FileText, Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Seasonal Deals | ${SITE.name}`,
};

interface PageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: PageProps) => {
    const initialDealType = typeof searchParams?.dealType === 'string' ? searchParams.dealType : '';
    const initialStore = typeof searchParams?.store === 'string' ? searchParams.store : '';
    const pageNum = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(initialDealType, initialStore, pageNum, {
            seasonalDeals: true,
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
            label: 'Seasonal Deals',
            icon: <FileText className="w-4 h-4 mr-2" />,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen pb-6">
            <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-7">
                <main className="xl:col-span-4 lg:col-span-5 px-3">
                    <div className="flex flex-col xl:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs md:mb-3 pt-6 pb-3">
                        <Breadcrumb items={breadcrumbItems} />

                        <DealsFilters showTypeFilter={true} dealTypes={dealTypes} stores={stores} />
                    </div>

                    <DealsListing
                        initDealListResponse={dealListResponse}
                        params={{
                            seasonalDeals: true,
                        }}
                        dealTypeName="Seasonal Deals"
                        dealTypeSlug="seasonal-deals"
                    />
                </main>

                <Sidebar />
            </div>
        </div>
    );
};

export default Page;
