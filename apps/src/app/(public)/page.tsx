import { DesktopPage } from '@/features/public/home';
import { getActiveDeals, getDealTypes, getStores } from '@/services';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async (props: Props) => {
    const searchParams = await props.searchParams;

    const initialDealType = (searchParams.dealType as string) || '';
    const initialStore = (searchParams.store as string) || '';
    const pageNum = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(initialDealType, initialStore, pageNum, {
            limit: 50,
            sortField: 'updatedAt',
        }),
        getDealTypes(),
        getStores(),
    ]);

    return <DesktopPage dealListResponse={dealListResponse} dealTypes={dealTypes} stores={stores} />;
};

export default Page;
