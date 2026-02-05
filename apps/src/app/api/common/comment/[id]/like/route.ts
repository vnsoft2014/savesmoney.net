import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { createRateLimiter, enforceRateLimit } from '@/utils/rarelimit';
import { validateRequest } from '@/utils/validators/validate';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const likeSchema = Joi.object({
    userId: Joi.string().length(24).hex().optional(),
});

const likeLimiter = createRateLimiter({
    requests: 5,
    duration: '1 m',
});

export const PATCH = withObjectId(async (req: Request, { params }: Props) => {
    const rateLimitResponse = await enforceRateLimit(req, likeLimiter);

    if (rateLimitResponse) return rateLimitResponse;

    const { isValid, value: validatedBody, response } = await validateRequest(req, likeSchema);
    if (!isValid) return response;

    try {
        await connectDB();

        const { id: commentId } = await params;

        const userId = validatedBody?.userId;

        const comment = await Comment.findById(commentId);
        if (!comment) return NextResponse.json({ message: 'Comment not found' }, { status: 404 });

        if (!userId) {
            comment.likes += 1;
            await comment.save();

            return NextResponse.json({
                success: true,
                liked: true,
                likes: comment.likes,
                guest: true,
            });
        }

        const role = await authCheck(req);
        if (!assertRole(role, USER_ROLES)) {
            const { userId } = await req.json();

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
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED }, { status: 500 });
        }
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
});
