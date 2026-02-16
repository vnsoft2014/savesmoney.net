'use client';

import { useEffect, useState } from 'react';

type AffiliateStore = {
    name: string;
    slug: string;
    affiliateId: string;
    enabled: boolean;
};

export default function AffiliateSettings() {
    const [stores, setStores] = useState<AffiliateStore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch('/api/settings/affiliate');
                const data = await res.json();

                setStores(data.affiliateStores || []);
            } catch (error) {
                console.error('Failed to load affiliate stores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const handleChange = (index: number, field: keyof AffiliateStore, value: string | boolean) => {
        const updated = [...stores];
        updated[index] = { ...updated[index], [field]: value };
        setStores(updated);
    };

    const addStore = () => {
        setStores([...stores, { name: '', slug: '', affiliateId: '', enabled: true }]);
    };

    const save = async () => {
        await fetch('/api/settings/affiliate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ affiliateStores: stores }),
        });

        alert('Saved!');
    };

    if (loading) return <div>Loading affiliate settings...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Affiliate Stores</h2>

            {stores.map((store, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 border p-4 rounded-lg">
                    <input
                        className="border p-2 rounded"
                        placeholder="Store Name"
                        value={store.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                    />

                    <input
                        className="border p-2 rounded"
                        placeholder="Slug (amazon)"
                        value={store.slug}
                        onChange={(e) => handleChange(index, 'slug', e.target.value)}
                    />

                    <input
                        className="border p-2 rounded"
                        placeholder="Affiliate ID"
                        value={store.affiliateId}
                        onChange={(e) => handleChange(index, 'affiliateId', e.target.value)}
                    />

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={store.enabled}
                            onChange={(e) => handleChange(index, 'enabled', e.target.checked)}
                        />
                        Enabled
                    </label>
                </div>
            ))}

            <button onClick={addStore} className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Store
            </button>

            <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded ml-4">
                Save
            </button>
        </div>
    );
}
