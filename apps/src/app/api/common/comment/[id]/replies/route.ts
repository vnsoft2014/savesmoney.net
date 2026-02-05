import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { withObjectId } from '@/middleware/withObjectId';
import Comment from '@/models/Comment';
import { validateRequest } from '@/utils/validators/validate';
import Joi from 'joi';
import mongoose, { PipelineStage } from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const commentSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(20).default(5),
    sort: Joi.string().valid('oldest', 'newest').default('oldest'),
});

export const GET = withObjectId(async (req: Request, { params }: Props) => {
    const { isValid, value: validatedBody, response } = await validateRequest(req, commentSchema);
    if (!isValid) return response;

    try {
        await connectDB();

        const { id } = await params;

        const { page, limit, sort } = validatedBody;

        const parentId = new mongoose.Types.ObjectId(id);
        const skip = (page - 1) * limit;

        const sortStage: PipelineStage.Sort['$sort'] = sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 };

        const replies = await Comment.aggregate([
            { $match: { parentId, isApproved: true } },
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },

            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$user' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                        { $project: { avatar: 1, name: 1, _id: 1 } },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
            },

            {
                $lookup: {
                    from: 'comments',
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$parentId', '$$commentId'] }, { $eq: ['$isApproved', true] }],
                                },
                            },
                        },
                        { $count: 'count' },
                    ],
                    as: 'repliesMeta',
                },
            },
            {
                $addFields: {
                    repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesMeta.count', 0] }, 0] },
                },
            },
            { $project: { repliesMeta: 0 } },
        ]);

        const total = await Comment.countDocuments({ parentId, isApproved: true });

        return NextResponse.json({
            success: true,
            data: replies,
            pagination: { page, limit, total, hasMore: page * limit < total },
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
});
