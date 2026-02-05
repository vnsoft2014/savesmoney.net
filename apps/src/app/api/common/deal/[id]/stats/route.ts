import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Comment from '@/models/Comment';
import DealStats from '@/models/DealStats';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: Props) {
    try {
        await connectDB();

        const { id } = await params;

        const [stats, commentCount] = await Promise.all([
            DealStats.findOne({ dealId: id }),
            Comment.countDocuments({ deal: id, isApproved: true }),
        ]);

        return NextResponse.json({
            views: stats?.views || 0,
            likes: stats?.likes || 0,
            purchaseClicks: stats?.purchaseClicks || 0,
            comments: commentCount,
            likedBy: stats?.likedBy || [],
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
