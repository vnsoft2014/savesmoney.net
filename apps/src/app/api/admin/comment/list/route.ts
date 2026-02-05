import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Comment from '@/models/Comment';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const QuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow('').default(''),
    sortField: Joi.string().valid('_id', 'createdAt', 'name').default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export async function GET(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(req.url);

        const { value, error } = QuerySchema.validate(Object.fromEntries(searchParams), {
            convert: true,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.VALIDATION,
                },
                { status: 400 },
            );
        }

        const { page, limit, search, sortField, sortOrder } = value;

        const skip = (page - 1) * limit;

        const filter: any = {};

        if (search) {
            filter.$or = [{ name: { $regex: search, $options: 'i' } }];
        }

        const sort: Record<string, 1 | -1> = {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
        };

        const [data, total] = await Promise.all([
            Comment.find(filter)
                .populate('deal', 'shortDescription')
                .populate('user', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Comment.countDocuments(filter),
        ]);

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
