'use client';

import { Button } from '@/shared/shadecn/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function StoreFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get('sort') || 'newest';

    const handleSortChange = (sort: 'newest' | 'popular') => {
        const params = new URLSearchParams(searchParams.toString());

        params.set('sort', sort);
        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex gap-4">
            <Button
                size="sm"
                onClick={() => handleSortChange('newest')}
                variant={currentSort === 'newest' ? 'default' : 'outline'}
                className={
                    currentSort === 'newest'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }
            >
                Newest Stores
            </Button>

            <Button
                size="sm"
                onClick={() => handleSortChange('popular')}
                variant={currentSort === 'popular' ? 'default' : 'outline'}
                className={
                    currentSort === 'popular'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }
            >
                Popular Stores
            </Button>
        </div>
    );
}
