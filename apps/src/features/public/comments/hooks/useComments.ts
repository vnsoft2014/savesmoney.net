'use client';

import useSWRInfinite from 'swr/infinite';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    return res.json();
};

export function useComments(dealId: string, sortBy: string) {
    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.pagination?.hasMore) return null;

        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/${dealId}/comments?page=${pageIndex + 1}&limit=5&sort=${sortBy}`;
    };

    const { data, error, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(getKey, fetcher);

    const comments = data?.flatMap((page) => page.data) ?? [];
    const total = data?.[data.length - 1].total ?? 0;
    const hasMore = data?.[data.length - 1]?.pagination?.hasMore ?? false;

    return {
        comments,
        total,
        isLoading,
        isValidating,
        error,
        loadMore: () => setSize(size + 1),
        hasMore,
        mutate,
    };
}
