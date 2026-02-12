import { getTopViewedDeals } from '@/services';
import PopularDealsItem from './components/PopularDealsItem';

export default async function PopularDeals() {
    const deals = await getTopViewedDeals();

    if (deals.length === 0) return null;

    return (
        <div className="space-y-4">
            <h4 className="font-sans-condensed font-bold">Popular Deals</h4>

            <div className="block mt-4 space-y-4">
                {deals.map((item: any) => (
                    <PopularDealsItem key={item.deal._id} deal={item.deal} />
                ))}
            </div>
        </div>
    );
}
