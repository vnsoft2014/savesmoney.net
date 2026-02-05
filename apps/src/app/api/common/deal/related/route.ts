import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const QuerySchema = Joi.object({
    dealId: Joi.string().hex().length(24).optional(),
    dealType: Joi.alternatives().try(Joi.string().hex().length(24), Joi.array().items(Joi.string().hex().length(24))),
    store: Joi.string().hex().length(24).optional(),
    limit: Joi.number().integer().min(1).max(50).default(10),
});

export async function GET(req: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);

        const queryData = {
            dealId: searchParams.get('dealId'),
            dealType: searchParams.getAll('dealType'),
            store: searchParams.get('store'),
            limit: searchParams.get('limit'),
        };

        const { error, value } = QuerySchema.validate(queryData);
        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 400 },
            );
        }

        const { dealId, dealType, store, limit } = value;

        const filter: any = {};

        if (dealId) {
            filter._id = { $ne: new mongoose.Types.ObjectId(dealId) };
        }

        if (dealType?.length) {
            filter.dealType = {
                $in: dealType.map((id: string) => new mongoose.Types.ObjectId(id)),
            };
        }

        if (store) {
            filter.store = new mongoose.Types.ObjectId(store);
        }

        const today = new Date();
        const fromDate = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z');

        filter.$or = [{ expireAt: { $gte: fromDate } }, { expireAt: null }];

        const deals = await Deal.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('dealType')
            .populate('store')
            .lean();

        return NextResponse.json({
            success: true,
            data: deals,
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
