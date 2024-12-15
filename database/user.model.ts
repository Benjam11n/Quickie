import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  preferences: {
    favoriteNotes: string[];
    dislikedNotes: string[];
  };
  history: {
    triedPerfumes: Array<{
      perfumeId: mongoose.Types.ObjectId;
      date: Date;
      rating: number;
      review?: string;
    }>;
    wishlist: mongoose.Types.ObjectId[];
  };
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    bio: { type: String },
    preferences: {
      favoriteNotes: [String],
      dislikedNotes: [String],
    },
    history: {
      triedPerfumes: [
        {
          perfumeId: {
            type: Schema.Types.ObjectId,
            ref: 'Perfume',
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          review: String,
        },
      ],
      wishlist: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Perfume',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const User = models?.User || model<IUser>('User', UserSchema);

export default User;
