import React from 'react';

import { Ads } from '@/shared/components/widgets';
import { DealFull } from '@/shared/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DealCard } from '../../deals/components';

type Props = {
    deals: DealFull[];
};

export default function ActiveDealsTab({ deals }: Props) {
    return (
        <section>
            <div className="py-4">
                <div className="grid gap-3 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
                    {deals.map((deal, index) => {
                        return (
                            <React.Fragment key={`initial-${deal._id}`}>
                                <DealCard deal={deal} />

                                {(index + 1) % 10 === 0 && <Ads slot="2176866845" />}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="mt-3 text-center">
                    <Link
                        href="/deals"
                        className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:gap-2 transition-all"
                    >
                        See all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
