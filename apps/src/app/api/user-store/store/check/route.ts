import connectDB from '@/DB/connectDB';
import { UserStore } from '@/models/UserStore';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: 'Invalid userId' }, { status: 400 });
        }

        const store = await UserStore.findOne({
            author: userId,
            isActive: true,
        });

        return NextResponse.json({
            success: true,
            data: store,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
