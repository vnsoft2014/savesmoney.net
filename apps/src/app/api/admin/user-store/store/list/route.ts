import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { UserStore } from '@/models/UserStore';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const currentPage = Math.max(parseInt(searchParams.get('page') || '1'), 1);
        const limit = Math.max(parseInt(searchParams.get('limit') || '30'), 1);

        const skip = (currentPage - 1) * limit;

        const totalCount = await UserStore.countDocuments();

        const stores = await UserStore.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: stores,
            pagination: {
                currentPage,
                totalPages,
                totalCount,
                limit,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
