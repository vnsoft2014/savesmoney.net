'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/shared/shadecn/ui/button';
import { Input } from '@/shared/shadecn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function StoreFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSort = searchParams.get('sort') || 'all';
    const currentSearch = searchParams.get('search') || '';

    const [search, setSearch] = useState(currentSearch);
    const debouncedSearch = useDebounce(search.trim(), 500);

    const updateParams = (paramsObj: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(paramsObj).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        params.set('page', '1');

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const resetAllFilters = () => {
        setSearch('');

        startTransition(() => {
            router.push('?');
        });
    };

    const handleSortChange = (sort: string) => {
        if (sort === 'all') {
            resetAllFilters();
            return;
        }

        updateParams({ sort });
    };

    const handleClearSearch = () => {
        setSearch('');
        updateParams({ search: '' });
    };

    useEffect(() => {
        updateParams({ search: debouncedSearch });
    }, [debouncedSearch]);

    const hasFilters = currentSearch || searchParams.get('sort');

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-3">
                {hasFilters && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetAllFilters}
                        className="p-0 text-red-500 hover:text-red-600"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}

                <ArrowUpDown size={18} className="text-gray-500" />

                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-45 text-sm">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">All Stores</SelectItem>
                        <SelectItem value="popular">Popular Stores</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <Input
                    placeholder="Search stores by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-16 text-sm"
                />

                {search && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                )}

                {isPending && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-block w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                )}
            </div>
        </div>
    );
}
