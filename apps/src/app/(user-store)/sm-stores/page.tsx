import { HeroAffiliateCTA, StoreFilter, StoresListing } from '@/features/public/sm-stores';
import { getUserStores } from '@/services/user-store';
import { Breadcrumb } from '@/shared/components/common';
import { SITE } from '@/utils/site';
import { FileText, Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `SavesMoney Stores | ${SITE.name}`,
};

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async (props: Props) => {
    const searchParams = await props.searchParams;

    const initialSort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'name';

    const pageNum = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;

    const search = typeof searchParams?.search === 'string' ? searchParams.search : '';

    const storeListResponse = await getUserStores(initialSort, pageNum, search);

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4" />,
        },
        {
            label: 'All SM Stores',
            icon: <FileText className="w-4 h-4" />,
            active: true,
        },
    ];

    return (
        <div className="container min-h-screen">
            <div className="px-3 pt-6 pb-10">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-2 breadcrumbs mb-3 md:mb-6">
                    <Breadcrumb items={breadcrumbItems} />

                    <StoreFilter />
                </div>

                <HeroAffiliateCTA />

                <StoresListing
                    initStoreListResponse={storeListResponse}
                    storeName="Saves Money Stores"
                    storeSlug="sm-stores"
                />
            </div>
        </div>
    );
};

export default Page;
