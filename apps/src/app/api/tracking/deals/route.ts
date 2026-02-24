import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
        const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

        const skip = (page - 1) * limit;

        const filter = {
            status: 'published',
            purchaseLink: { $exists: true, $ne: '' },
        };

        const [deals, total] = await Promise.all([
            Deal.find(filter, {
                discountPrice: 1,
                purchaseLink: 1,
            })
                .lean()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),

            Deal.countDocuments(filter),
        ]);

        return NextResponse.json({
            success: true,
            data: deals,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
