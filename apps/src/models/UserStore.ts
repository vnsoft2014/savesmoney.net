import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserStore extends Document {
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    description?: string;
    author?: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserStoreSchema: Schema<IUserStore> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        logo: {
            type: String,
        },
        website: {
            type: String,
        },
        description: {
            type: String,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export const UserStore: Model<IUserStore> =
    mongoose.models.UserStore || mongoose.model<IUserStore>('UserStore', UserStoreSchema);
