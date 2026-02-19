import { Ads } from '@/shared/components/widgets';
import { PopularDeals } from '../deals';

const Sidebar = () => {
    return (
        <aside className="lg:col-span-2 xl:border-l mt-6 lg:mt-0 border-gray-200 lg:min-h-screen px-3">
            <div className="lg:sticky top-4 space-y-4">
                <Ads slot="2013037708" />
                <PopularDeals />
            </div>
        </aside>
    );
};

export default Sidebar;
