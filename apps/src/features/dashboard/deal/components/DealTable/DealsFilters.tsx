'use client';

import { getDealTypes } from '@/services';
import { DealType } from '@/shared/types';
import { useEffect, useState } from 'react';

type Props = {
    search: string;
    setSearch: (value: string) => void;
    dealTypeFilter: string;
    setDealTypeFilter: (value: string) => void;
    createdAtFrom: string;
    setCreatedAtFrom: (value: string) => void;
    createdAtTo: string;
    setCreatedAtTo: (value: string) => void;
    expireAtFrom: string;
    setExpireAtFrom: (value: string) => void;
    expireAtTo: string;
    setExpireAtTo: (value: string) => void;
    onClearFilters: () => void;
};

export default function DealsFilters({
    search,
    setSearch,
    dealTypeFilter,
    setDealTypeFilter,
    createdAtFrom,
    setCreatedAtFrom,
    createdAtTo,
    setCreatedAtTo,
    expireAtFrom,
    setExpireAtFrom,
    expireAtTo,
    setExpireAtTo,
    onClearFilters,
}: Props) {
    const [dealTypes, setDealTypes] = useState<DealType[]>([]);
    const [loading, setLoading] = useState(false);

    const hasActiveFilters = search || dealTypeFilter || createdAtFrom || createdAtTo || expireAtFrom || expireAtTo;

    useEffect(() => {
        const fetchDealTypes = async () => {
            try {
                setLoading(true);
                const res = await getDealTypes();
                setDealTypes(res || []);
            } catch (error) {
                console.error('Failed to fetch deal types', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealTypes();
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1 min-w-40">
                    <label className="text-left text-xs font-medium text-gray-600">Deal Type</label>

                    <select
                        value={dealTypeFilter}
                        onChange={(e) => setDealTypeFilter(e.target.value)}
                        className="h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        disabled={loading}
                    >
                        <option value="">All</option>

                        {dealTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-left text-xs font-medium text-gray-600">Expire From</label>
                    <input
                        type="date"
                        value={expireAtFrom}
                        onChange={(e) => setExpireAtFrom(e.target.value)}
                        className="h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-left text-xs font-medium text-gray-600">Expire To</label>
                    <input
                        type="date"
                        value={expireAtTo}
                        onChange={(e) => setExpireAtTo(e.target.value)}
                        className="h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-left text-xs font-medium text-gray-600">Created From</label>
                    <input
                        type="date"
                        value={createdAtFrom}
                        onChange={(e) => setCreatedAtFrom(e.target.value)}
                        className="h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-left text-xs font-medium text-gray-600">Created To</label>
                    <input
                        type="date"
                        value={createdAtTo}
                        onChange={(e) => setCreatedAtTo(e.target.value)}
                        className="h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-55">
                    <label className="text-left text-xs font-medium text-gray-600">Search</label>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search deal..."
                        className="h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="h-10 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition text-sm font-medium"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
