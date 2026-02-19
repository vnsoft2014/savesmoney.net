import mongoose, { Document, Types } from 'mongoose';
import slugify from 'slugify';

import './DealType';
import './Store';
import './User';

export interface DealDocument extends Document {
    image?: string;
    dealType: Types.ObjectId[];
    store: Types.ObjectId;
    author: Types.ObjectId;
    expireAt?: Date | null;
    disableExpireAt?: boolean;
    isFlashDeal?: boolean;
    shortDescription: string;
    slug: string;
    description: string;
    flashDeal: boolean;
    flashDealExpireHours: number;
    originalPrice?: number;
    discountPrice?: number;
    percentageOff?: string;
    purchaseLink: string;
    couponCode: string;
    tags?: string[];
    hotTrend?: boolean;
    holidayDeals?: boolean;
    seasonalDeals?: boolean;
    coupon?: boolean;
    clearance?: boolean;
    invalid?: boolean;
    userStore?: Types.ObjectId;
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
            default: null,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        originalPrice: Number,
        discountPrice: Number,
        percentageOff: String,
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
            default: false,
        },
        flashDealExpireHours: Number,
        tags: {
            type: [String],
            default: [],
        },
        hotTrend: {
            type: Boolean,
            default: false,
        },
        holidayDeals: {
            type: Boolean,
            default: false,
        },
        seasonalDeals: {
            type: Boolean,
            default: false,
        },
        coupon: {
            type: Boolean,
            default: false,
        },
        coupons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon',
            },
        ],
        clearance: {
            type: Boolean,
            default: false,
        },
        disableExpireAt: {
            type: Boolean,
            default: false,
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

        const baseSlug = slugify(doc.shortDescription, {
            lower: true,
            strict: true,
        });

        let slug = baseSlug;
        let count = 1;

        while (await this.exists({ slug })) {
            slug = `${baseSlug}-${count++}`;
        }

        doc.slug = slug;
    }
});

const Deal = mongoose.models.Deals || mongoose.model<DealDocument>('Deals', DealSchema);
export default Deal;
