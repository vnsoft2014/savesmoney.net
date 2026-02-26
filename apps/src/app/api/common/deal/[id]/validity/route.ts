import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Deal from '@/models/Deal';
import Validations from '@/models/Validation';
import Joi from 'joi';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const paramsSchema = Joi.object({
    id: Joi.string().length(24).hex().required(),
});

const bodySchema = Joi.object({
    vote: Joi.string().valid('valid', 'invalid').required(),
});

export async function POST(req: Request, { params }: Props) {
    try {
        await connectDB();

        const paramValues = await params;
        const { error: paramError } = paramsSchema.validate(paramValues);
        if (paramError) {
            return NextResponse.json({ success: false, message: paramError.message }, { status: 400 });
        }

        const body = await req.json();
        const { error: bodyError, value } = bodySchema.validate(body);
        if (bodyError) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const { id: dealId } = paramValues;

        const deal = await Deal.findOne({
            _id: dealId,
            status: { $in: ['invalid', 'published'] },
        }).select('_id');

        if (!deal) {
            return NextResponse.json({ success: false, message: 'Deal not eligible for validation' }, { status: 400 });
        }

        const { vote } = value;

        const incField = vote === 'valid' ? 'valid' : 'invalid';

        const stats = await Validations.findOneAndUpdate(
            { deal: dealId },
            {
                $inc: { [incField]: 1 },
                $set: {
                    marked: false,
                },
            },
            { upsert: true, new: true },
        );

        return NextResponse.json({
            success: true,
            valid: stats.valid,
            invalid: stats.invalid,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
