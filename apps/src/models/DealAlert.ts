import mongoose from "mongoose";

const DealAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },

    keywords: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one keyword is required',
      },
      index: true,
    },

    channel: {
      type: String,
      enum: ['email'],
      required: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please use a valid email address',
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.models.DealAlert ||
  mongoose.model('DealAlert', DealAlertSchema);