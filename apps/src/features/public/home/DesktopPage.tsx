import { Ads } from '@/shared/components/widgets';
import { DealListResponse, DealType, Store, UserStore } from '@/shared/types';
import { DealsFilters } from '../deals';
import { DealsListing, DealTypesGrid } from './components';
import StoreSlider from './components/StoresSlider';
import { HomeSchema } from './seo';

interface Props {
    dealListResponse: DealListResponse;
    dealTypes: DealType[];
    stores: Store[];
    userStores: UserStore[];
}

const DesktopPage = async ({ dealListResponse, dealTypes, stores, userStores }: Props) => {
    return (
        <>
            <HomeSchema />

            <div className="container min-h-screen mx-auto">
                <div className="px-3 pt-6 pb-10 space-y-8">
                    <DealTypesGrid dealTypes={dealTypes} />

                    <StoreSlider stores={userStores} />

                    <Ads slot="2176866845" />

                    <section className="font-sans-condensed">
                        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-sm breadcrumbs mb-4">
                            <h3 className="text-lg lg:text-xl font-bold">All The Deals</h3>

                            <DealsFilters dealTypes={dealTypes} stores={stores} />
                        </div>

                        <DealsListing initDealListResponse={dealListResponse} />
                    </section>
                </div>
            </div>
        </>
    );
};

export default DesktopPage;
