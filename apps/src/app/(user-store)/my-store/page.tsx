'use client';

import { CreateStoreForm, OverView, StoreProfile } from '@/features/public/my-store/overview';
import { getUserStore } from '@/services/user-store';
import { Loading } from '@/shared/components/common';
import { useEffect, useState } from 'react';

export default function Page() {
    const [res, setRes] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            const data = await getUserStore();

            setRes(data);
            setLoading(false);
        };

        fetchStore();
    }, []);

    if (loading)
        return (
            <div className="min-h-screen flex justify-between items-center">
                <Loading />
            </div>
        );

    if (!res?.success) {
        return <CreateStoreForm />;
    }

    return (
        <>
            <StoreProfile store={res.data} />
            <OverView />
        </>
    );
}
