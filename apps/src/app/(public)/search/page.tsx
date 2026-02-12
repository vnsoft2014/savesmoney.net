import SearchsContent from '@/features/public/deal-detail/SearchsContent';
import DealsFilters from '@/features/public/deals/DealsFilters';
import Sidebar from '@/features/public/layout/Sidebar';
import { getDealTypes } from '@/services/admin/deal-type';
import { getStores } from '@/services/admin/store';
import { searchDeals } from '@/services/common/deal';
import Breadcrumb from '@/shared/components/common/Breadcrumb';
import { SITE } from '@/utils/site';
import { FileText, Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Search | ${SITE.name}`,
};

interface PageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: PageProps) => {
    const initialQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';
    const initialDealType = typeof searchParams?.dealType === 'string' ? searchParams.dealType : '';
    const initialStore = typeof searchParams?.store === 'string' ? searchParams.store : '';
    const pageNum = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;

    const [initialDealsData, dealTypes, stores] = await Promise.all([
        searchDeals(initialQuery, pageNum, 30, initialDealType, initialStore),
        getDealTypes(),
        getStores(),
    ]);

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-1" />,
        },
        {
            label: 'Search',
            href: `/search?q=${initialQuery}`,
            icon: <FileText className="w-4 h-4 mr-1" />,
        },
        {
            label: <span className="truncate min-w-0 max-w-2xs md:max-w-md">{initialQuery}</span>,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen mx-auto pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-5">
                <main className="lg:col-span-4 px-4">
                    <div className="flex flex-col xl:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs md:mb-3 py-3">
                        <Breadcrumb items={breadcrumbItems} />

                        <DealsFilters showTypeFilter={true} dealTypes={dealTypes.data} stores={stores.data} />
                    </div>

                    <SearchsContent
                        initialDealsData={initialDealsData}
                        initialDealType={initialDealType}
                        initialStore={initialStore}
                        initialQuery={initialQuery}
                    />
                </main>

                <Sidebar />
            </div>
        </div>
    );
};

export default Page;
