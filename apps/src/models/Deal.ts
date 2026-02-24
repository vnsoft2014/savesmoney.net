import mongoose, { Document, Types } from 'mongoose';

import { generateUniqueSlug } from '@/utils/sanitize';
import './Coupon';
import './DealType';
import './Store';
import './User';

export interface DealDocument extends Document {
    image?: string;

    dealType: Types.ObjectId[];

    store: Types.ObjectId;

    expireAt?: Date | null;

    shortDescription: string;

    slug: string;

    originalPrice?: number;
    discountPrice?: number;
    percentageOff?: string;

    purchaseLink: string;

    description: string;

    flashDeal?: boolean;
    flashDealExpireHours?: number;

    tags?: string[];

    hotTrend?: boolean;
    holidayDeals?: boolean;
    seasonalDeals?: boolean;

    coupon?: boolean;
    coupons?: Types.ObjectId[];

    clearance?: boolean;

    disableExpireAt?: boolean;

    author: Types.ObjectId;

    userStore?: Types.ObjectId | null;

    status?: 'pending' | 'published' | 'rejected' | 'invalid';

    createdAt: Date;
    updatedAt: Date;
}

const DealSchema = new mongoose.Schema(
    {
        image: String,
        dealType: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'DealTypes',
                required: true,
            },
        ],
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stores',
            required: true,
        },
        expireAt: {
            type: Date,
            required: false,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        originalPrice: {
            type: Number,
            require: true,
        },
        discountPrice: {
            type: Number,
            required: false,
        },
        percentageOff: {
            type: String,
            required: false,
        },
        purchaseLink: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        flashDeal: {
            type: Boolean,
            required: false,
        },
        flashDealExpireHours: {
            type: Number,
            required: false,
        },
        tags: {
            type: [String],
            default: undefined,
        },
        hotTrend: {
            type: Boolean,
            required: false,
        },
        holidayDeals: {
            type: Boolean,
            required: false,
        },
        seasonalDeals: {
            type: Boolean,
            required: false,
        },
        coupon: {
            type: Boolean,
            required: false,
        },
        coupons: {
            type: [
                {
                    code: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    comment: {
                        type: String,
                        required: false,
                        trim: true,
                    },
                },
            ],
            default: undefined,
        },
        clearance: {
            type: Boolean,
            required: false,
        },
        disableExpireAt: {
            type: Boolean,
            required: false,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        userStore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserStore',
            required: false,
            default: null,
        },
        status: {
            type: String,
            enum: ['pending', 'published', 'rejected', 'invalid'],
            default: 'published',
        },
    },
    {
        timestamps: true,
    },
);

DealSchema.index({ shortDescription: 1, author: 1 }, { unique: true });

DealSchema.pre('insertMany', async function (docs: DealDocument[]) {
    if (!Array.isArray(docs)) return;

    for (const doc of docs) {
        if (!doc.shortDescription) continue;

        const slug = generateUniqueSlug(doc.shortDescription);

        doc.slug = slug;
    }
});

const Deal = mongoose.models.Deals || mongoose.model<DealDocument>('Deals', DealSchema);
export default Deal;
