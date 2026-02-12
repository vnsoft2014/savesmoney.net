import { DealType } from '@/shared/types';
import Link from 'next/link';
import { ImageWithFallback } from '../../deal-detail/components';

type Props = {
    dealTypes: DealType[];
};

const DealTypesGrid = ({ dealTypes }: Props) => {
    return (
        <section className="font-sans-condensed">
            <h3 className="hidden md:block md:text-lg lg:text-xl font-bold">All Deal Types</h3>

            <div className="bg-white mt-5 py-3 md:py-4">
                <div id="deal-types" className="md:max-h-80 overflow-y-auto scroll-smooth">
                    <div className="grid grid-cols-4 xl:grid-cols-10 lg:grid-cols-8 md:grid-cols-6 gap-3 md:gap-6">
                        {dealTypes.map((dealType) => (
                            <Link
                                key={dealType._id}
                                href={`/deals/${dealType.slug}-${dealType._id}`}
                                prefetch={false}
                                className="group flex flex-col items-center cursor-pointer"
                            >
                                <div className="relative rounded-full overflow-hidden bg-gray-100 mb-4 transition-transform duration-300 group-hover:scale-105">
                                    <ImageWithFallback
                                        src={dealType.thumbnail}
                                        alt={dealType.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="text-xs md:text-sm uppercase font-bold tracking-tight text-center">
                                    {dealType.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealTypesGrid;
