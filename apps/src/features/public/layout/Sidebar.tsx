import GoogleAds from '../../../shared/components/widgets/Ads';
import { PopularDeals } from '../deals';

const Sidebar = () => {
    return (
        <aside className="xl:col-span-1 lg:col-span-2 lg:border-l mt-6 lg:mt-0 border-gray-200 lg:min-h-screen px-3 md:px-4">
            <div className="lg:sticky top-4 space-y-4">
                <GoogleAds slot="2013037708" />
                <PopularDeals />
            </div>
        </aside>
    );
};

export default Sidebar;
