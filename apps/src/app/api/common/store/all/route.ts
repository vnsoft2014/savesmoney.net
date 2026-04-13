import { MESSAGES } from '@/config/messages';
import connectDB from '@/lib/db/connectDB';
import Store from '@/models/Store';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const stores = await Store.find().sort({ name: 1 });

        return NextResponse.json({
            success: true,
            data: stores,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
