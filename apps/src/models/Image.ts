import mongoose, { Document, model, models, Schema } from 'mongoose';

export interface IImage extends Document {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
    uploadedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
    {
        url: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Image = models.Image || model<IImage>('Image', ImageSchema);
