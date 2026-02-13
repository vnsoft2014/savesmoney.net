import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const sort = searchParams.get('sort') || 'newest';
    const currentPage = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.max(parseInt(searchParams.get('limit') || '30'), 1);

    const skip = (currentPage - 1) * limit;

    try {
        if (sort === 'newest') {
            const totalCount = await UserStore.countDocuments({ isActive: true });

            const stores = await UserStore.find({ isActive: true })
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return NextResponse.json({
                success: true,
                data: stores,
                pagination: {
                    currentPage,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    limit,
                    hasNextPage: currentPage * limit < totalCount,
                    hasPrevPage: currentPage > 1,
                },
            });
        }

        if (sort === 'popular') {
            const aggregation = await Deal.aggregate([
                {
                    $match: {
                        userStore: { $ne: null },
                        status: 'published',
                    },
                },
                {
                    $lookup: {
                        from: 'dealstats',
                        localField: '_id',
                        foreignField: 'dealId',
                        as: 'stats',
                    },
                },
                {
                    $unwind: {
                        path: '$stats',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$userStore', // ✅ dùng userStore
                        totalViews: {
                            $sum: { $ifNull: ['$stats.views', 0] },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'userstores', // collection của UserStore
                        localField: '_id',
                        foreignField: '_id',
                        as: 'store',
                    },
                },
                {
                    $unwind: '$store',
                },
                {
                    $match: {
                        'store.isActive': true,
                    },
                },
                {
                    $project: {
                        _id: '$store._id',
                        name: '$store.name',
                        slug: '$store.slug',
                        logo: '$store.logo',
                        createdAt: '$store.createdAt',
                        totalViews: 1,
                    },
                },
                {
                    $sort: { totalViews: -1 },
                },
                {
                    $facet: {
                        data: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{ $count: 'count' }],
                    },
                },
            ]);

            const data = aggregation[0]?.data || [];
            const totalCount = aggregation[0]?.totalCount[0]?.count || 0;

            return NextResponse.json({
                success: true,
                data,
                pagination: {
                    currentPage,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    limit,
                    hasNextPage: currentPage * limit < totalCount,
                    hasPrevPage: currentPage > 1,
                },
            });
        }

        const totalCount = await UserStore.countDocuments({ isActive: true });

        const stores = await UserStore.find({ isActive: true }).skip(skip).limit(limit).lean();

        return NextResponse.json({
            success: true,
            data: stores,
            pagination: {
                currentPage,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit,
                hasNextPage: currentPage * limit < totalCount,
                hasPrevPage: currentPage > 1,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
