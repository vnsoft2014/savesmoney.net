'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/shared/shadecn/ui/button';
import { Input } from '@/shared/shadecn/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function StoreFilter() {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const searchParams = useSearchParams();

    const currentSort = searchParams.get('sort') || 'name';
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

    const handleSortChange = (sort: 'popular' | 'name') => {
        updateParams({
            sort,
            search: sort === 'name' ? search : '',
        });
    };

    // debounce search trigger
    useEffect(() => {
        if (currentSort !== 'name') return;

        updateParams({ search: debouncedSearch });
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4">
                <Button
                    size="sm"
                    onClick={() => handleSortChange('popular')}
                    variant={currentSort === 'popular' ? 'default' : 'outline'}
                >
                    Popular Stores
                </Button>

                <Button
                    size="sm"
                    onClick={() => handleSortChange('name')}
                    variant={currentSort === 'name' ? 'default' : 'outline'}
                >
                    Store Name
                </Button>
            </div>

            {currentSort === 'name' && (
                <div className="relative w-full md:w-64">
                    <Input
                        placeholder="Type store name..."
                        value={search}
                        className="text-sm pr-8"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {isPending && (
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 inline-block w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                    )}
                </div>
            )}
        </div>
    );
}
