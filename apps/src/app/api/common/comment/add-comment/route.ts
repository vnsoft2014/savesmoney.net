import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Comment from '@/models/Comment';
import Subscriber from '@/models/Subscriber';
import User from '@/models/User';
import { createRateLimiter, enforceRateLimit } from '@/utils/rarelimit';
import { cleanHtml } from '@/utils/sanitize';
import { validateRequest } from '@/utils/validators/validate';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const commentSchema = Joi.object({
    deal: Joi.string().required(),
    user: Joi.string().hex().length(24).optional().allow(null),
    username: Joi.string().required().trim(),
    userEmail: Joi.string().email().required().trim().lowercase(),
    content: Joi.string().min(1).max(1000).required().trim(),
    parentId: Joi.string().hex().length(24).optional().allow(null),
    ipAddress: Joi.string().optional().allow(null),
}).unknown(false);

const commentLimiter = createRateLimiter({
    requests: 3,
    duration: '1 m',
});

export async function POST(req: Request) {
    const rateLimitResponse = await enforceRateLimit(req, commentLimiter);

    if (rateLimitResponse) return rateLimitResponse;

    const { isValid, value: validatedBody, response } = await validateRequest(req, commentSchema);
    if (!isValid) return response;

    try {
        await connectDB();

        if (validatedBody.user) {
            const user = await User.findById(validatedBody.user).select('isBlocked');

            if (!user) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'User not found',
                    },
                    { status: 404 },
                );
            }

            if (user.isBlocked) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Your account has been blocked from commenting',
                    },
                    { status: 403 },
                );
            }
        }

        const sanitizedContent = cleanHtml(validatedBody.content);
        const sanitizedUsername = cleanHtml(validatedBody.username);

        if (!sanitizedContent) {
            return NextResponse.json({ success: false, message: 'Invalid content' }, { status: 400 });
        }

        const comment = new Comment({
            ...validatedBody,
            content: sanitizedContent,
            username: sanitizedUsername,
            isApproved: true, //!!isAuthenticated,
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        });

        await comment.save();

        await Subscriber.findOneAndUpdate(
            { email: validatedBody.userEmail },
            {
                $setOnInsert: {
                    name: sanitizedUsername,
                    email: validatedBody.userEmail,
                    userId: validatedBody.user ?? null,
                    isRegisteredUser: !!validatedBody.user,
                    source: 'comment',
                },
            },
            { upsert: true, new: true },
        );

        return NextResponse.json({
            success: true,
            message: 'Comment added successfully!',
            comment: comment,
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
