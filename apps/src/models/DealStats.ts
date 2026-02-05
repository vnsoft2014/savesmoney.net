import mongoose from 'mongoose';

const DealStatsSchema = new mongoose.Schema({
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deals',
        required: true,
        unique: true,
    },

    views: {
        type: Number,
        default: 0,
    },

    likes: {
        type: Number,
        default: 0,
    },

    likedBy: {
        type: [String],
        default: [],
    },

    purchaseClicks: {
        type: Number,
        default: 0,
    },
});

export default mongoose.models.DealStats || mongoose.model('DealStats', DealStatsSchema);
