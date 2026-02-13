import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { createRateLimiter, enforceRateLimit } from '@/utils/rarelimit';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const likeLimiter = createRateLimiter({
    requests: 3,
    duration: '1 m',
});

export const PATCH = withObjectId(async (req: Request, { params }: Props) => {
    const rateLimitResponse = await enforceRateLimit(req, likeLimiter);

    if (rateLimitResponse) return rateLimitResponse;

    try {
        await connectDB();

        const { id: commentId } = await params;

        const comment = await Comment.findById(commentId);
        if (!comment) return NextResponse.json({ message: 'Comment not found' }, { status: 404 });

        const role = await authCheck(req);

        if (assertRole(role, USER_ROLES)) {
            const authenticated = await authUser(req);

            const userId = authenticated!.sub;

            const user = await User.findById(userId).select('isBlocked');

            if (!user) {
                return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
            }

            if (user.isBlocked) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Your account has been blocked',
                    },
                    { status: 403 },
                );
            }

            const alreadyLiked = comment.likedBy.some((id: any) => id.toString() === userId);

            if (alreadyLiked) {
                // Unlike
                comment.likedBy = comment.likedBy.filter((id: any) => id.toString() !== userId);
                comment.likes = Math.max(0, comment.likes - 1);
            } else {
                // Like
                if (!comment.likedBy.map((id: any) => id.toString()).includes(userId)) {
                    comment.likedBy.push(userId);
                    comment.likes += 1;
                }
            }

            await comment.save();

            return NextResponse.json({
                success: true,
                liked: !alreadyLiked,
                likes: comment.likes,
                guest: false,
            });
        } else {
            comment.likes += 1;
            await comment.save();

            return NextResponse.json({
                success: true,
                liked: true,
                likes: comment.likes,
                guest: true,
            });
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
});
