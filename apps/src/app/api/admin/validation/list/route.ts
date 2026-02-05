import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Validation from '@/models/validation';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const QuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid('all', 'valid', 'invalid').default('all'),
    marked: Joi.string().valid('all', 'true', 'false').default('all'),
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

        const { page, limit, status, marked } = value;
        const skip = (page - 1) * limit;

        const dealMatch: Record<string, any> = {};
        const validationMatch: Record<string, any> = {};

        if (status === 'valid') {
            dealMatch.invalid = { $ne: true };
        }

        if (status === 'invalid') {
            dealMatch.invalid = true;
        }

        if (marked === 'true') {
            validationMatch.marked = true;
        }

        if (marked === 'false') {
            validationMatch.marked = false;
        }

        const [data, total] = await Promise.all([
            Validation.find(validationMatch)
                .populate({
                    path: 'deal',
                    select: 'image shortDescription expireAt purchaseLink invalid',
                    match: dealMatch,
                })
                .sort({ marked: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Validation.countDocuments(validationMatch),
        ]);

        const filteredData = data.filter((item) => item.deal !== null);

        return NextResponse.json({
            success: true,
            data: filteredData,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
