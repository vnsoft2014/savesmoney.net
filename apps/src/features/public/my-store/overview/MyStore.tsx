'use client';

import { Loading } from '@/components/common';
import { useEffect, useState } from 'react';
import { getUserStore } from '../services';
import { CreateStoreForm, OverView, StoreProfile } from './components';

export default function MyStore() {
    const [storeRes, setStoreRes] = useState<any>(null);
    const [loadingStore, setLoadingStore] = useState(false);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoadingStore(true);
                const data = await getUserStore();
                setStoreRes(data);
            } finally {
                setLoadingStore(false);
            }
        };

        fetchStore();
    }, []);

    if (loadingStore) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!storeRes?.success) {
        return (
            <div className="min-h-fullpy-6">
                <CreateStoreForm />
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-10 pt-6 pb-10">
            <StoreProfile store={storeRes.data} />
            <OverView />
        </div>
    );
}
