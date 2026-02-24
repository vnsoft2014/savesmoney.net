import mongoose, { Types } from 'mongoose';

export interface DealAdminNoteDocument extends Document {
    deal: Types.ObjectId;

    draft?: Types.ObjectId;

    user: Types.ObjectId;

    admin: Types.ObjectId;

    message: string;

    type: 'info' | 'warning' | 'rejected_reason';

    isRead: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const DealAdminNoteSchema = new mongoose.Schema(
    {
        deal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deals',
            required: true,
            index: true,
        },

        draft: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DealDraft',
            required: false,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ['info', 'warning', 'rejected_reason'],
            default: 'info',
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const DealAdminNote =
    mongoose.models.DealAdminNote || mongoose.model<DealAdminNoteDocument>('DealAdminNote', DealAdminNoteSchema);

export default DealAdminNote;
