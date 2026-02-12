import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { UserStore } from '@/models/UserStore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '6');

        const skip = (page - 1) * limit;

        const total = await UserStore.countDocuments();

        const stores = await UserStore.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        return NextResponse.json({
            success: true,
            data: stores,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
