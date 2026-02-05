import Sidebar from '@/features/public/layout/Sidebar';
import { Ads } from '@/shared/components/widgets';
import { DealListResponse, DealType, Store } from '@/shared/types';
import { DealsFilters } from '../deals/filters';
import { DealsGrid, DealTypesGrid } from './components';
import { HomeSchema } from './seo';

interface Props {
    dealListResponse: DealListResponse;
    dealTypes: DealType[];
    stores: Store[];
}

const DesktopPage = async ({ dealListResponse, dealTypes, stores }: Props) => {
    return (
        <>
            <HomeSchema />

            <div className="container min-h-screen mx-auto px-3 pb-6">
                <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-7">
                    <main className="xl:col-span-4 lg:col-span-5 px-3 pt-6 pb-10 space-y-8">
                        <DealTypesGrid dealTypes={dealTypes} />

                        <Ads slot="2176866845" />

                        <section>
                            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-sm breadcrumbs mb-4">
                                <h3 className="text-lg lg:text-xl font-bold">All The Deals</h3>

                                <DealsFilters showTypeFilter={true} dealTypes={dealTypes} stores={stores} />
                            </div>

                            <DealsGrid initDealListResponse={dealListResponse} />
                        </section>
                    </main>

                    <Sidebar />
                </div>
            </div>
        </>
    );
};

export default DesktopPage;
