import { Breadcrumb } from '@/components/common';
import { SITE } from '@/config/site';
import { DealsFilters, DealsListing } from '@/features/public/deals';
import { getActiveDeals, getDealTypes, getStores } from '@/services';
import { FileText, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

type Props = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata() {
    return {
        title: 'Electronics | SavesMoney',
        alternates: {
            canonical: `${SITE.url}/electronics`,
        },
    };
}

const Page = async ({ searchParams }: Props) => {
    const sp = searchParams ? await searchParams : {};

    const dealTypeId = '695694a58ad0acfed51c278a';

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

    const breadcrumbItems = [
        {
            label: 'Home',
            href: '/',
            icon: <Home className="w-4 h-4 mr-2" />,
        },
        {
            label: 'Electronics',
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
                    dealTypeName={'Electronics'}
                    dealTypeSlug={'electronics'}
                />
            </div>
        </div>
    );
};

export default Page;
