import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import DealStats from '@/models/DealStats';
import User from '@/models/User';
import Joi from 'joi';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const paramsSchema = Joi.object({
    id: Joi.string().length(24).hex().required(),
});

const bodySchema = Joi.object({
    userId: Joi.string().length(24).hex().optional(),
});

export async function POST(req: NextRequest, { params }: Props) {
    try {
        await connectDB();

        const { value: validatedQuery, error: paramError } = paramsSchema.validate(await params);
        if (paramError) {
            return NextResponse.json({ success: false, message: paramError.message }, { status: 400 });
        }

        const { id: dealId } = validatedQuery;

        let body: any = null;
        try {
            body = await req.json();
        } catch {}

        const { error: bodyError, value: validatedBody } = bodySchema.validate(body ?? {});
        if (bodyError) {
            return NextResponse.json({ success: false, message: bodyError.message }, { status: 400 });
        }

        const userId = validatedBody?.userId;

        let stats = await DealStats.findOne({ dealId });

        if (!stats) {
            stats = await DealStats.create({
                dealId,
                likes: 0,
                likedBy: [],
            });
        }

        if (!userId) {
            stats.likes += 1;
            await stats.save();

            return NextResponse.json({
                success: true,
                liked: true,
                likes: stats.likes,
                guest: true,
            });
        }

        const role = await authCheck(req);
        if (!assertRole(role, USER_ROLES)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED }, { status: 401 });
        }

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
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
