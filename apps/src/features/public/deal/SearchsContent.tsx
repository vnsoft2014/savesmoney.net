'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { searchDeals } from '@/services/common/deal';
import Loading from '../../../shared/components/common/Loading';
import { DealCard } from '../../common';
import Pagination from '../deals/components/Pagination';
import NoDeals from '../deals/NoDeals';

type SearchsContentProps = {
    initialDealsData?: any;
    initialDealType?: string;
    initialStore?: string;
    initialQuery: string;
};

const SearchsContent = ({
    initialDealsData,
    initialDealType = '',
    initialStore = '',
    initialQuery,
}: SearchsContentProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const initialPage = Number(searchParams.get('page')) || 1;
    const [page, setPage] = useState(initialPage);

    const [dealsData, setDealsData] = useState<any>(initialDealsData || null);
    const [loading, setLoading] = useState(!initialDealsData);

    const finalDealType = initialDealType || searchParams.get('dealType') || '';
    const finalStore = initialStore || searchParams.get('store') || '';

    const prevFilterRef = useRef({ dealType: finalDealType, store: finalStore });

    useEffect(() => {
        const filterChanged =
            prevFilterRef.current.dealType !== finalDealType || prevFilterRef.current.store !== finalStore;

        prevFilterRef.current = { dealType: finalDealType, store: finalStore };

        const nextPage = filterChanged ? 1 : page;

        if (filterChanged && page !== 1) {
            setPage(1);
            return;
        }

        let mounted = true;

        const fetchDeals = async () => {
            setLoading(true);
            const res = await searchDeals(initialQuery, nextPage, 30, finalDealType, finalStore);

            if (mounted) setDealsData(res);
            setLoading(false);
        };

        fetchDeals();

        return () => {
            mounted = false;
        };
    }, [page, initialQuery, finalDealType, finalStore]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);

        const params = new URLSearchParams(searchParams as any); // TS workaround
        params.set('page', String(newPage));

        router.push(`${pathname}?${params.toString()}`);
    };

    if (loading) return <Loading />;

    if (!dealsData?.success || dealsData.data.length === 0) {
        return <NoDeals />;
    }

    return (
        <>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
                {dealsData.data.map((deal: any) => {
                    return <DealCard key={deal._id} deal={deal} />;
                })}
            </div>

            <Pagination
                currentPage={page}
                totalPages={dealsData.pagination.totalPages}
                hasNextPage={dealsData.pagination.hasNextPage}
                hasPrevPage={dealsData.pagination.hasPrevPage}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default SearchsContent;
