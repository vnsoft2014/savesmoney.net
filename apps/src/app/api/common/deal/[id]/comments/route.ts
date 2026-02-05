import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Comment from '@/models/Comment';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const paramsSchema = Joi.object({
    id: Joi.string().length(24).hex().required(),
});

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(5),
    sort: Joi.string().valid('newest', 'oldest', 'popular').default('newest'),
    parentId: Joi.string().length(24).hex().allow(null),
});

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: Request, { params }: Props) {
    try {
        const resolvedParams = await params;

        const { error: paramsError } = paramsSchema.validate(resolvedParams);

        if (paramsError) {
            return NextResponse.json({ success: false, message: paramsError.details[0].message }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const queryObject = {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            sort: searchParams.get('sort'),
            parentId: searchParams.get('parentId'),
        };

        const { value: query, error: queryError } = querySchema.validate(queryObject);

        if (queryError) {
            return NextResponse.json({ success: false, message: queryError.details[0].message }, { status: 400 });
        }

        const { page, limit, sort, parentId } = query;
        const skip = (page - 1) * limit;

        await connectDB();

        let sortQuery: any = { createdAt: -1 };
        if (sort === 'oldest') sortQuery = { createdAt: 1 };
        if (sort === 'popular') sortQuery = { likes: -1 };

        const filter: any = {
            deal: resolvedParams.id,
            isApproved: true,
            parentId: parentId ?? null,
        };

        const comments = await Comment.find(filter)
            .populate({
                path: 'user',
                select: 'name avatar',
            })
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Comment.countDocuments(filter);

        let result = comments;

        if (!parentId && comments.length) {
            const parentIds = comments.map((c) => c._id);

            const repliesCount = await Comment.aggregate([
                {
                    $match: {
                        parentId: { $in: parentIds },
                        isApproved: true,
                    },
                },
                {
                    $group: {
                        _id: '$parentId',
                        count: { $sum: 1 },
                    },
                },
            ]);

            const repliesMap: Record<string, number> = {};
            repliesCount.forEach((r) => {
                repliesMap[r._id.toString()] = r.count;
            });

            result = comments.map((c) => ({
                ...c,
                repliesCount: repliesMap[c._id.toString()] || 0,
            }));
        }

        return NextResponse.json({
            success: true,
            data: result,
            pagination: {
                page,
                limit,
                total,
                hasMore: page * limit < total,
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
