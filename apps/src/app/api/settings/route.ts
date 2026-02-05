import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Settings from '@/models/Settings';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();

        const settings = await Settings.findOne().lean();

        return NextResponse.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
