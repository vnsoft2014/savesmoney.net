import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SubscriberDocument extends Document {
    name: string;
    email: string;
    userId?: mongoose.Types.ObjectId;
    isRegisteredUser: boolean;
    source: 'popup' | 'footer' | 'page';
    subscribedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriberSchema = new Schema<SubscriberDocument>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    isRegisteredUser: {
        type: Boolean,
        default: false,
    },
    source: {
        type: String,
        enum: ['popup', 'subscribe-box'],
        default: 'popup',
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscriber: Model<SubscriberDocument> =
    mongoose.models.Subscriber || mongoose.model<SubscriberDocument>('Subscriber', SubscriberSchema);

export default Subscriber;
