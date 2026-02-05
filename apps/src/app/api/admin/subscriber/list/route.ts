import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Subscriber from '@/models/Subscriber';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const QuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortField: Joi.string().valid('_id', 'createdAt', 'name').default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    subscribedAtFrom: Joi.string().allow('').optional(),
    subscribedAtTo: Joi.string().allow('').optional(),
});

export async function GET(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            return NextResponse.json({
                success: false,
                message: MESSAGES.ERROR.FORBIDDEN,
            });
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

        const { page, limit, sortField, sortOrder, subscribedAtFrom, subscribedAtTo } = value;

        const skip = (page - 1) * limit;

        const filter: any = {};

        const subscribedAtFilters: any[] = [];

        if (subscribedAtFrom || subscribedAtTo) {
            const rangeFilter: any = {};
            if (subscribedAtFrom) {
                const fromDate = new Date(`${subscribedAtFrom}T00:00:00.000Z`);
                if (!isNaN(fromDate.getTime())) rangeFilter.$gte = fromDate;
            }
            if (subscribedAtTo) {
                const toDate = new Date(`${subscribedAtTo}T23:59:59.999Z`);
                if (!isNaN(toDate.getTime())) rangeFilter.$lte = toDate;
            }

            if (Object.keys(rangeFilter).length > 0) {
                subscribedAtFilters.push(rangeFilter);
            }
        }

        if (subscribedAtFilters.length > 0) {
            if (subscribedAtFilters.includes(null) && subscribedAtFilters.length > 1) {
                filter.$or = subscribedAtFilters.map((f) =>
                    f === null ? { subscribedAt: null } : { subscribedAt: f },
                );
            } else {
                filter.subscribedAt = subscribedAtFilters[0];
            }
        }

        const sort: Record<string, 1 | -1> = {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
        };

        const [data, total] = await Promise.all([
            Subscriber.find(filter).sort(sort).skip(skip).limit(limit),
            Subscriber.countDocuments(filter),
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
