import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Store from '@/models/Store';
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

        const { searchParams } = new URL(req.url);

        const queryObj = {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            search: searchParams.get('search'),
            sortField: searchParams.get('sortField'),
            sortOrder: searchParams.get('sortOrder'),
        };

        const { value, error } = QuerySchema.validate(queryObj, {
            abortEarly: false,
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
            Store.find(filter).sort(sort).skip(skip).limit(limit),
            Store.countDocuments(filter),
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
