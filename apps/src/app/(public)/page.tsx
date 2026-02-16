import { DesktopPage, MobilePage } from '@/features/public/home';
import { getActiveDeals, getDealTypes, getStores } from '@/services';
import { getUserStores } from '@/services/user-store';
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

    const [dealListResponse, dealTypes, stores, useStores] = await Promise.all([
        getActiveDeals(initialDealType, initialStore, 1, {
            limit: 50,
        }),
        getDealTypes(),
        getStores(),
        getUserStores('newest', 1),
    ]);

    return isMobile ? (
        <MobilePage dealListResponse={dealListResponse} dealTypes={dealTypes} userStores={useStores.data} />
    ) : (
        <DesktopPage
            dealListResponse={dealListResponse}
            dealTypes={dealTypes}
            stores={stores}
            userStores={useStores.data}
        />
    );
};

export default Page;
