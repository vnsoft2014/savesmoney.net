import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import User from '@/models/User';
import Joi from 'joi';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const UserListQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow('').max(100).default(''),
    sortField: Joi.string().valid('createdAt', 'name', 'email', 'role', 'isBlocked').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    role: Joi.string().valid('admin', 'contributor', 'user').optional(),
});

export async function GET(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ONLY)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);

        const rawQuery = {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            search: searchParams.get('search'),
            sortField: searchParams.get('sortField'),
            sortOrder: searchParams.get('sortOrder'),
            role: searchParams.get('role'),
        };

        const { value, error } = UserListQuerySchema.validate(rawQuery, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid query parameters',
                    errors: error.details.map((d) => d.message),
                },
                { status: 400 },
            );
        }

        const { page, limit, search, sortField, sortOrder, role: userRole } = value;
        const skip = (page - 1) * limit;

        const query: any = {};

        if (search) {
            query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        }

        if (userRole) {
            query.role = userRole;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query),
        ]);

        return NextResponse.json({
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
