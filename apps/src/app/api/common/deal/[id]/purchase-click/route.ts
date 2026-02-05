import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
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

        const { id: dealId } = await params;

        const updated = await DealStats.findOneAndUpdate(
            {
                dealId,
            },
            {
                $inc: { purchaseClicks: 1 },
            },
            { upsert: true, new: true },
        );

        return NextResponse.json({
            success: true,
            counted: !!updated,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
