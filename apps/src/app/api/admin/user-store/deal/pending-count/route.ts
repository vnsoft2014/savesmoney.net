import { NextResponse } from 'next/server';

import { MESSAGES } from '@/config/messages';
import connectDB from '@/lib/db/connectDB';
import Deal from '@/models/Deal';

export async function GET() {
    try {
        await connectDB();

        const count = await Deal.countDocuments({
            status: 'pending',
        });

        return NextResponse.json({
            success: true,
            count,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
