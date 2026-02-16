import SearchsContent from '@/features/public/deal-detail/SearchsContent';
import DealsFilters from '@/features/public/deals/DealsFilters';
import { getDealTypes, getStores, searchDeals } from '@/services';
import Breadcrumb from '@/shared/components/common/Breadcrumb';
import { SITE } from '@/utils/site';
import { FileText, Home } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: `Search | ${SITE.name}`,
};

interface Props {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async (props: Props) => {
    const searchParams = await props.searchParams;

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
            <div className="px-3 pt-6 pb-10">
                <div className="flex flex-col xl:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs md:mb-3 py-3">
                    <Breadcrumb items={breadcrumbItems} />

                    <DealsFilters dealTypes={dealTypes} stores={stores} />
                </div>

                <SearchsContent
                    initialDealsData={initialDealsData}
                    initialDealType={initialDealType}
                    initialStore={initialStore}
                    initialQuery={initialQuery}
                />
            </div>
        </div>
    );
};

export default Page;
