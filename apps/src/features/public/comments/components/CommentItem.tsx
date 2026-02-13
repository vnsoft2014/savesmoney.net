import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { likeAsGuest, likeAsUser } from '@/services/comment.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadecn/ui/avatar';
import { Button } from '@/shared/shadecn/ui/button';
import { Separator } from '@/shared/shadecn/ui/separator';
import { Comment } from '@/shared/types';
import { getInitials } from '@/utils/utils';
import { ChevronDown, Loader2, ThumbsUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCommentReplies } from '../hooks/useCommentReplies';
import CommentForm from './CommentForm';

type Props = {
    comment: Comment;
    dealId: string;
    level?: number;
    onMutate: () => void;
};

export default function CommentItem({ comment, dealId, level = 0, onMutate }: Props) {
    const { user, isSignin } = useAuth();
    const [replying, setReplying] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [guestLikedIds, setGuestLikedIds] = useState<string[]>([]);

    const { replies, isLoading, mutate: mutateReplies } = useCommentReplies(comment._id, expanded);

    useEffect(() => {
        if (!isSignin) {
            const likes = JSON.parse(localStorage.getItem('guest_liked_comments') || '[]');
            setGuestLikedIds(likes);
        }
    }, [isSignin]);

    const isLiked = useMemo(() => {
        if (isSignin) {
            return comment.likedBy?.includes(user?._id ?? '');
        }

        return guestLikedIds.includes(comment._id);
    }, [comment, isSignin, user, guestLikedIds]);

    const handleLike = async () => {
        if (loading) return;
        if (isLiked) return;

        setLoading(true);

        if (!isSignin) {
            const res = await likeAsGuest(comment._id);

            if (res.success) {
                const updatedLikes = [...guestLikedIds, comment._id];

                localStorage.setItem('guest_liked_comments', JSON.stringify(updatedLikes));

                setGuestLikedIds(updatedLikes);
            }
        } else {
            await likeAsUser(comment._id);
        }

        setLoading(false);

        onMutate();
    };

    return (
        <div className={cn('group', level > 0 ? 'ml-4 md:ml-12 border-l-2 pl-4 mt-4' : 'pb-3 md:pb-6')}>
            <div className="flex gap-4">
                <Avatar className="hidden md:block h-10 w-10 border">
                    <AvatarImage src={comment.user?.avatar} />
                    <AvatarFallback>{getInitials(comment.user?.name || comment.username)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="font-semibold text-sm">{comment.user?.name || comment.username}</div>
                    <p className="text-sm">{comment.content}</p>

                    <div className="flex gap-2 pt-1">
                        <Button
                            size="sm"
                            disabled={loading}
                            variant={isLiked ? 'default' : 'outline'}
                            onClick={handleLike}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            {comment.likes}
                        </Button>

                        <Button size="sm" variant="ghost" onClick={() => setReplying(!replying)}>
                            Reply
                        </Button>
                    </div>

                    {comment.repliesCount > 0 && (
                        <Button variant="link" className="p-0" onClick={() => setExpanded(!expanded)}>
                            {expanded ? 'Hide' : 'Show'} {comment.repliesCount} replies
                            <ChevronDown className={cn('ml-1 h-3 w-3', expanded && 'rotate-180')} />
                        </Button>
                    )}
                </div>
            </div>

            {replying && (
                <div className="my-4">
                    <CommentForm
                        dealId={dealId}
                        parentId={comment._id}
                        onSuccess={() => {
                            setReplying(false);
                            onMutate();

                            if (expanded) {
                                mutateReplies();
                            }
                        }}
                    />
                </div>
            )}

            {expanded && (
                <div className="mt-4 space-y-4">
                    {isLoading && (
                        <div className="flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                        </div>
                    )}

                    {replies.map((r: Comment) => (
                        <CommentItem
                            key={r._id}
                            comment={r}
                            dealId={dealId}
                            level={level + 1}
                            onMutate={() => {
                                mutateReplies();
                                onMutate();
                            }}
                        />
                    ))}
                </div>
            )}

            {level === 0 && <Separator className="mt-4 md:mt-6 group-last:hidden" />}
        </div>
    );
}
