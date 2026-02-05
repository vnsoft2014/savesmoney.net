import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import DealStats from '@/models/DealStats';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const now = new Date();

        const data = await DealStats.aggregate([
            { $sort: { views: -1 } },
            {
                $lookup: {
                    from: 'deals',
                    localField: 'dealId',
                    foreignField: '_id',
                    as: 'deal',
                },
            },

            { $unwind: '$deal' },

            {
                $lookup: {
                    from: 'stores',
                    localField: 'deal.store',
                    foreignField: '_id',
                    as: 'store',
                },
            },
            {
                $unwind: {
                    path: '$store',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $match: {
                    'deal.invalid': { $ne: true },
                    $or: [
                        { 'deal.expireAt': null },
                        { 'deal.disableExpireAt': true },
                        { 'deal.expireAt': { $gte: now } },
                    ],
                },
            },

            { $limit: 8 },

            {
                $project: {
                    _id: 0,
                    views: 1,
                    likes: 1,
                    deal: {
                        _id: '$deal._id',
                        store: {
                            _id: '$store._id',
                            name: '$store.name',
                        },
                        shortDescription: '$deal.shortDescription',
                        slug: '$deal.slug',
                        image: '$deal.image',
                        purchaseLink: '$deal.purchaseLink',
                        originalPrice: '$deal.originalPrice',
                        discountPrice: '$deal.discountPrice',
                        percentageOff: '$deal.percentageOff',
                        expireAt: '$deal.expireAt',
                        clearance: '$deal.clearance',
                        coupon: '$deal.coupon',
                        disableExpireAt: '$deal.disableExpireAt',
                        createdAt: '$deal.createdAt',
                    },
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
