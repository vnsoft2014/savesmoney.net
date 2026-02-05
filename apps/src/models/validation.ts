import mongoose from 'mongoose';

const ValidationSchema = new mongoose.Schema({
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deals',
        required: true,
        unique: true,
    },

    valid: {
        type: Number,
        default: 0,
    },

    invalid: {
        type: Number,
        default: 0,
    },

    marked: {
        type: Boolean,
        default: false,
        index: true,
    },
});

export default mongoose.models.Validation || mongoose.model('Validation', ValidationSchema);
