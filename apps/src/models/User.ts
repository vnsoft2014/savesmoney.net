import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please use a valid email address',
      ],
    },
    password: {
      type: String,
      required: true
    },
    passwordString: {
      type: String,
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'contributor', 'admin']
    },
    isBlocked: {
      type: Boolean,
      default: false,
      index: true
    },
    blockedAt: {
      type: Date,
      default: null
    },
    blockReason: {
      type: String,
      default: ''
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.Users || mongoose.model('Users', UserSchema);
export default User;
