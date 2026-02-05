import { getRelatedDeals } from '@/services';
import { RelatedDealsClient } from './components';
interface Props {
    dealId: string;
    storeName: string;
    storeId: string;
}

export default async function RelatedDeals(props: Props) {
    const deals = await getRelatedDeals(props.dealId, props.storeId);

    if (!deals.length) return null;

    return <RelatedDealsClient {...props} deals={deals} />;
}
