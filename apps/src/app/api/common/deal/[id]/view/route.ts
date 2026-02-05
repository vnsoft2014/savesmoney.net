import connectDB from '@/DB/connectDB';
import { MESSAGES } from '@/constants/messages';
import DealStats from '@/models/DealStats';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(_: Request, { params }: Props) {
    try {
        await connectDB();

        const { id } = await params;

        await DealStats.findOneAndUpdate({ dealId: id }, { $inc: { views: 1 } }, { upsert: true, new: true });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
