import { DesktopPage, MobilePage } from '@/features/public/home';
import { getActiveDeals, getDealTypes, getStores } from '@/services';
import { headers } from 'next/headers';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async (props: Props) => {
    const header = await headers();
    const ua = header.get('user-agent') || '';
    const isMobile = /iphone|android|mobile/i.test(ua);

    const searchParams = await props.searchParams;

    const initialDealType = (searchParams.dealType as string) || '';
    const initialStore = (searchParams.store as string) || '';

    const [dealListResponse, dealTypes, stores] = await Promise.all([
        getActiveDeals(initialDealType, initialStore, 1, {
            limit: 50,
        }),
        getDealTypes(),
        getStores(),
    ]);

    return isMobile ? (
        <MobilePage dealListResponse={dealListResponse} dealTypes={dealTypes} stores={stores} />
    ) : (
        <DesktopPage dealListResponse={dealListResponse} dealTypes={dealTypes} stores={stores} />
    );
};

export default Page;
