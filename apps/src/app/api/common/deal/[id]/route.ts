import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: Props) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const populate = searchParams.get('populate') === 'true';

        const { id } = await params;

        let query = Deal.findOne({
            _id: id,
            status: { $in: ['published', 'invalid'] },
        });

        if (populate) {
            query = query.populate('dealType').populate('store').populate('author');
        }

        const deal = await query.lean();

        if (deal) {
            return NextResponse.json({ success: true, data: deal });
        } else {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 204 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
