import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

import './DealType';
import './Store';
import './User';

export interface DealDocument extends Document {
    shortDescription: string;
    slug: string;
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
            unique: true,
            index: true,
        },
        originalPrice: Number,
        discountPrice: Number,
        percentageOff: String,
        purchaseLink: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
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
        clearance: {
            type: Boolean,
            default: false,
        },
        disableExpireAt: {
            type: Boolean,
            default: false,
        },
        invalid: {
            type: Boolean,
            default: false,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

DealSchema.pre('insertMany', async function (docs: DealDocument[]) {
    if (!Array.isArray(docs)) return;

    for (const doc of docs) {
        if (!doc.shortDescription) continue;

        const baseSlug = slugify(doc.shortDescription, {
            lower: true,
            strict: true,
            locale: 'vi',
        });

        let slug = baseSlug;
        let count = 1;

        // 'this' là model
        while (await this.exists({ slug })) {
            slug = `${baseSlug}-${count++}`;
        }

        doc.slug = slug;
    }
});

const Deal = mongoose.models.Deals || mongoose.model<DealDocument>('Deals', DealSchema);
export default Deal;
