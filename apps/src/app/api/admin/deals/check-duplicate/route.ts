import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Deal from '@/models/Deal';
import Joi from 'joi';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const checkPurchaseLinkSchema = Joi.object({
    purchaseLink: Joi.string().uri().optional().messages({
        'string.base': 'purchaseLink must be a string',
        'string.uri': 'purchaseLink must be a valid URL',
    }),

    shortDescription: Joi.string().trim().optional().messages({
        'string.base': 'shortDescription must be a string',
        'string.min': 'shortDescription is too short',
    }),

    dealId: Joi.string().hex().length(24).optional().messages({
        'string.hex': 'dealId must be a valid ObjectId',
        'string.length': 'dealId must be a valid ObjectId',
    }),
}).or('purchaseLink', 'shortDescription');

export async function POST(req: Request) {
    try {
        await connectDB();

        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.FORBIDDEN,
                },
                {
                    status: 403,
                },
            );
        }

        const body = await req.json();

        const { error, value } = checkPurchaseLinkSchema.validate(body, {
            abortEarly: false,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.VALIDATION,
                },
                { status: 400 },
            );
        }

        const { purchaseLink, shortDescription, dealId } = value;

        const orConditions: any[] = [];

        if (purchaseLink) {
            orConditions.push({ purchaseLink });
        }

        if (shortDescription) {
            orConditions.push({ shortDescription });
        }

        const query: any = {};

        if (orConditions.length > 0) {
            query.$or = orConditions;
        }

        if (dealId) {
            query._id = { $ne: new mongoose.Types.ObjectId(dealId) };
        }

        const existingDeal = await Deal.findOne(query).select('_id');

        return NextResponse.json({
            success: true,
            isDuplicate: Boolean(existingDeal),
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
