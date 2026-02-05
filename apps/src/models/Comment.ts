import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deals",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      default: "Unregistered",
    },

    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please use a valid email address',
      ],
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      default: null,
    },

    likes: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    isApproved: {
      type: Boolean,
      default: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Comment =
  mongoose.models.Comments || mongoose.model("Comments", CommentSchema);

export default Comment;