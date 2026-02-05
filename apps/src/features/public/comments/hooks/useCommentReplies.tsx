import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCommentReplies(commentId: string, enabled: boolean) {
    const { data, isLoading, isValidating, mutate } = useSWR(
        enabled ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/comment/${commentId}/replies` : null,
        fetcher,
    );

    return {
        replies: data?.data || [],
        isLoading,
        isValidating,
        mutate,
    };
}
