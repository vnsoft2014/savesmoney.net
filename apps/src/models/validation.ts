import mongoose, { Document, Types } from 'mongoose';
import './Deal';

export interface ValidationDocument extends Document {
    deal: Types.ObjectId;

    valid: {
        type: Number;
        default: 0;
    };

    invalid: number;

    marked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ValidationSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    },
);

export default mongoose.models.Validation || mongoose.model<ValidationDocument>('Validation', ValidationSchema);
