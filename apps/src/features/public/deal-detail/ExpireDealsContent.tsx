'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getExpiredDeals } from '@/services/common/deal';
import { getDaysExpired } from '@/utils/deal';
import { fetcher, formatDate } from '@/utils/utils';
import useSWR from 'swr';
import Loading from '../../../shared/components/common/Loading';
import Pagination from '../../common/Pagination';
import DealPrice from '../deals/components/DealPrice';
import NoDeals from '../deals/components/NoDeals';

type PageProps = {
    dealType?: string;
    dealStore?: string;
};

const ExpireDealsListing = ({ dealType, dealStore }: PageProps) => {
    const [page, setPage] = useState(1);
    const [dealsData, setDealsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();

    const finalDealType = dealType || searchParams.get('dealType') || '';
    const finalDealStore = dealStore || searchParams.get('dealStore') || '';

    const { data: dealTypeRes } = useSWR('/api/common/deal-type/all', fetcher);

    const dealTypeMap = useMemo(() => {
        if (!dealTypeRes?.data) return {};
        return dealTypeRes?.data.reduce((acc: any, item: any) => {
            acc[item.slug] = item.name;
            return acc;
        }, {});
    }, [dealTypeRes]);

    useEffect(() => {
        let isMounted = true;

        const fetchDeals = async () => {
            setLoading(true);
            const res = await getExpiredDeals(finalDealType, finalDealStore, page);
            if (isMounted) {
                setDealsData(res);
                setLoading(false);
            }
        };

        fetchDeals();

        return () => {
            isMounted = false;
        };
    }, [finalDealType, finalDealStore, page]);

    if (loading) return <Loading />;

    if (!dealsData?.success || dealsData.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {dealsData.data.map((deal: any) => {
                const daysExpired = getDaysExpired(deal.expireAt);

                return (
                    <div
                        key={deal._id}
                        className="py-3 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                        {deal.image && (
                            <div className="relative w-full px-3 mb-4 overflow-hidden">
                                <img src={deal.image} alt={deal.shortDescription} className="h-48 object-cover" />

                                <div
                                    className={`absolute top-0 right-3 inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold
                    ${daysExpired > 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                  `}
                                >
                                    {daysExpired > 0 ? `${daysExpired} days ago` : `${Math.abs(daysExpired)} days left`}
                                </div>
                            </div>
                        )}

                        <div className="px-4">
                            <h3 className="min-h-16 mb-2 text-sm font-semibold text-gray-800 line-clamp-3">
                                <Link href={`/deals/deal-detail/${deal._id}`}>{deal.shortDescription}</Link>
                            </h3>

                            <DealPrice
                                originalPrice={deal.originalPrice}
                                discountPrice={deal.discountPrice}
                                percentageOff={deal.percentageOff}
                            />

                            <div className="flex justify-between items-center mt-2 mb-2"></div>

                            <div className="flex justify-start items-center gap-1 text-sm mb-3 pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-500">Exp. date:</span>
                                <span className="font-semibold text-gray-700">{formatDate(deal.expireAt)}</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            <Pagination
                currentPage={page}
                totalPages={dealsData.pagination.totalPages}
                hasNextPage={dealsData.pagination.hasNextPage}
                hasPrevPage={dealsData.pagination.hasPrevPage}
                onPageChange={setPage}
            />
        </div>
    );
};

export default ExpireDealsListing;
