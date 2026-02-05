'use client';

import { Button } from '@/shared/shadecn/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useComments } from '../hooks/useComments';
import CommentHeader from './CommentHeader';
import CommentItem from './CommentItem';
import CommentSkeleton from './CommentSkeleton';

type Props = {
    dealId: string;
    onReady?: (mutate: () => void) => void;
};

export default function CommentList({ dealId, onReady }: Props) {
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
    const [showComments, setShowComments] = useState(true);

    const { comments, isLoading, hasMore, loadMore, isValidating, mutate } = useComments(dealId, sortBy);

    useEffect(() => {
        onReady?.(mutate);
    }, [mutate, onReady]);

    if (isLoading) return <CommentSkeleton />;

    return (
        <div className="p-3 md:p-6">
            <CommentHeader
                count={comments.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                showComments={showComments}
                onToggle={() => setShowComments((v) => !v)}
            />

            {showComments && (
                <div className="block mt-3 md:mt-6">
                    {comments.map((c) => (
                        <CommentItem key={c._id} comment={c} dealId={dealId} onMutate={mutate} />
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={loadMore} disabled={isValidating} className="w-full max-w-xs">
                        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load more comments'}
                    </Button>
                </div>
            )}
        </div>
    );
}
