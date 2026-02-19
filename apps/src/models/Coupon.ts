import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
