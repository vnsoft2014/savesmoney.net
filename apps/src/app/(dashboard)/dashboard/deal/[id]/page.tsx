'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import EditDealForm from '@/features/dashboard/deal/EditDealForm';
import { getDealById } from '@/features/dashboard/services';
import { Loading } from '@/shared/components/common';

export default function Page() {
    const { id } = useParams();
    const router = useRouter();

    const [deal, setDeal] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDeal = async () => {
            try {
                const data = await getDealById(id as string);

                if (!data) {
                    router.replace('/404');
                    return;
                }

                setDeal(data);
            } finally {
                setLoading(false);
            }
        };

        fetchDeal();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!deal) return null;

    return <EditDealForm deal={deal} />;
}
