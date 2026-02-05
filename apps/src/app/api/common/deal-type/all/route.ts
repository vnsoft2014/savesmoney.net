import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import DealType from '@/models/DealType';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const dealTypes = await DealType.find();

        return NextResponse.json({
            success: true,
            data: dealTypes,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
