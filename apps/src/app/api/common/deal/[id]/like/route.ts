import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import DealStats from '@/models/DealStats';
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

        const { id: dealId } = await params;

        let stats = await DealStats.findOne({ dealId });

        if (!stats) {
            stats = await DealStats.create({
                dealId,
                likes: 0,
                likedBy: [],
            });
        }

        const role = await authCheck(req);

        if (assertRole(role, USER_ROLES)) {
            const authenticated = await authUser(req);

            const userId = authenticated!.sub;

            const user = await User.findById(userId).select('isBlocked');

            if (!user) {
                return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
            }

            if (user.isBlocked) {
                return NextResponse.json({ success: false, message: 'Your account has been blocked' }, { status: 403 });
            }

            const isLiked = stats.likedBy.includes(userId);

            if (isLiked) {
                stats.likedBy = stats.likedBy.filter((id: string) => id !== userId);
                stats.likes = Math.max(0, stats.likes - 1);
            } else {
                stats.likedBy.push(userId);
                stats.likes += 1;
            }

            await stats.save();

            return NextResponse.json({
                success: true,
                liked: !isLiked,
                likes: stats.likes,
                guest: false,
            });
        } else {
            stats.likes += 1;
            await stats.save();

            return NextResponse.json({
                success: true,
                liked: true,
                likes: stats.likes,
                guest: true,
            });
        }
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
});
