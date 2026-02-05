'use client';

import { ChevronDown, MessageCircle, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadecn/ui/avatar';
import { Button } from '@/shared/shadecn/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { Separator } from '@/shared/shadecn/ui/separator';
import { Skeleton } from '@/shared/shadecn/ui/skeleton';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { likeCommentAsGuest, likeCommentAsUser } from '@/services/comment.service';
import { CommentData } from '@/types';
import { getInitials } from '@/utils/utils';
import CommentForm from '../../comments/components/CommentForm';

const getGuestLikes = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem('guest_liked_comments') || '[]');
    } catch {
        return [];
    }
};

const setGuestLikes = (likes: string[]) => {
    localStorage.setItem('guest_liked_comments', JSON.stringify(likes));
};

function CommentsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto w-full space-y-8 py-8">
            <div className="flex justify-between items-center border-b pb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-9 w-35" />
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

type Props = {
    dealId: string;
    refreshKey: number;
};

export default function CommentList({ dealId, refreshKey }: Props) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'oldest' | 'newest' | 'popular'>('newest');
    const [showComments, setShowComments] = useState(true);
    const [guestLikes, setGuestLikesState] = useState<string[]>([]);

    const { user, isSignin } = useAuth();

    useEffect(() => {
        fetchComments(1, true);
    }, [dealId, sortBy, refreshKey]);

    useEffect(() => {
        if (!isSignin) {
            setGuestLikesState(getGuestLikes());
        }
    }, [isSignin]);

    const fetchComments = async (pageNumber = 1, reset = false) => {
        try {
            if (pageNumber === 1) setLoading(true);
            else setLoadingMore(true);
            const res = await fetch(`/api/common/deal/${dealId}/comments?page=${pageNumber}&limit=5&sort=${sortBy}`);
            const data = await res.json();
            if (data.success) {
                setComments((prev) => (reset ? data.data : [...prev, ...data.data]));
                setHasMore(data.pagination.hasMore);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const updateComments = async () => {
        const res = await fetch(
            `/api/common/deal/${dealId}/comments?page=1&limit=${comments.length || 5}&sort=${sortBy}`,
        );
        const data = await res.json();
        if (data.success) setComments(data.data);
    };

    const handleLike = useCallback(
        async (commentId: string) => {
            if (liking) return;

            try {
                setLiking(true);
                if (!isSignin) {
                    const guestLikes = getGuestLikes();
                    if (guestLikes.includes(commentId)) return;

                    const res = await likeCommentAsGuest(commentId);

                    if (res.success) {
                        setGuestLikes([...guestLikes, commentId]);
                        setGuestLikesState([...guestLikes, commentId]);
                    }
                } else {
                    await likeCommentAsUser(commentId, user!._id);
                }
            } catch (_) {
            } finally {
                setLiking(false);
            }

            updateComments();
        },
        [liking, isSignin, user],
    );

    const toggleReplies = (commentId: string) => {
        const newSet = new Set(expandedReplies);
        newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
        setExpandedReplies(newSet);
    };

    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        [],
    );

    const formatDate = (date: string) => dateFormatter.format(new Date(date));

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage);
    }, [page, fetchComments]);

    const renderComments = useCallback(
        (list: CommentData[], level = 0) => {
            return list.map((c) => {
                const isExpanded = expandedReplies.has(c._id);
                const isLiked = isSignin ? c.likedBy?.includes(user?._id ?? '') : guestLikes.includes(c._id);

                return (
                    <div key={c._id} className={cn('group', level > 0 ? 'ml-4 md:ml-12 mt-4 border-l-2 pl-4' : 'py-6')}>
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={c.user?.avatar} />
                                <AvatarFallback className="text-muted-foreground">
                                    {getInitials(c.user?.name || 'U')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm leading-none">
                                        {c.user?.name || c.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                                </div>

                                <p className="text-sm text-foreground/90 leading-relaxed">{c.content}</p>

                                <div className="flex items-center gap-2 pt-1">
                                    <Button
                                        variant={isLiked ? 'default' : 'outline'}
                                        size="sm"
                                        className={cn(
                                            'px-3 py-1 border rounded flex items-center gap-1 text-sm shadow-none',
                                            isLiked && 'bg-blue-500',
                                            isLiked &&
                                                (!isSignin
                                                    ? ' hover:bg-blue-500 cursor-not-allowed'
                                                    : 'hover:bg-blue-600'),
                                        )}
                                        onClick={() => handleLike(c._id)}
                                    >
                                        <ThumbsUp className={cn('h-3.5 w-3.5', isLiked && 'fill-current')} />
                                        <span>{c.likes}</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-3 py-1 border rounded text-sm"
                                        onClick={() => setReplyingId(replyingId === c._id ? null : c._id)}
                                    >
                                        Reply
                                    </Button>
                                </div>

                                {c.repliesCount > 0 && (
                                    <Button
                                        variant="link"
                                        className="mt-4 p-0 h-auto text-sm text-primary hover:no-underline hover:text-primary/90"
                                        onClick={() => toggleReplies(c._id)}
                                    >
                                        {isExpanded ? 'Hide' : 'Show'} {c.repliesCount} replies
                                        <ChevronDown
                                            className={cn(
                                                'ml-1 h-3 w-3 transition-transform',
                                                isExpanded && 'rotate-180',
                                            )}
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {replyingId === c._id && (
                            <div className="mt-4">
                                <CommentForm
                                    dealId={dealId}
                                    parentId={c._id}
                                    onSuccess={() => {
                                        setReplyingId(null);
                                        updateComments();
                                    }}
                                />
                            </div>
                        )}

                        {isExpanded && c.replies && (
                            <div className="animate-in fade-in slide-in-from-top-1">
                                {renderComments(c.replies, level + 1)}
                            </div>
                        )}
                        {level === 0 && <Separator className="mt-6" />}
                    </div>
                );
            });
        },
        [expandedReplies, replyingId, isSignin, user, guestLikes, handleLike, formatDate],
    );

    if (loading) return <CommentsSkeleton />;

    return (
        <div className="p-3 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">{comments.length} Comments</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
                        {showComments ? 'Hide' : 'Show'}
                    </Button>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-35 h-9 text-xs">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {showComments && (
                <div className="space-y-2">
                    {comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                            <div className="bg-muted rounded-full p-4">
                                <MessageCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                No comments yet. Be the first to start the conversation!
                            </p>
                        </div>
                    ) : (
                        renderComments(comments)
                    )}
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={loadMore} disabled={loadingMore} className="w-full max-w-xs">
                        {loadingMore ? 'Loading...' : 'Load more comments'}
                    </Button>
                </div>
            )}
        </div>
    );
}
