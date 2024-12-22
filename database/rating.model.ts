// models/rating.model.ts
import { Schema, model, models, Types, Document } from 'mongoose';

export interface IRating {
  userId: Types.ObjectId;
  perfumeId: Types.ObjectId;
  rating: number;
  review?: string;
  likes?: number;
  likedBy?: Types.ObjectId[];
}

export interface IRatingDoc extends IRating, Document {}

const RatingSchema = new Schema<IRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    perfumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Perfume',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Ensure one rating per user per perfume
RatingSchema.index({ userId: 1, perfumeId: 1 }, { unique: true });

// Other indexes
RatingSchema.index({ perfumeId: 1 });
RatingSchema.index({ rating: 1 });
RatingSchema.index({ createdAt: -1 });

export const Rating = models?.Rating || model<IRating>('Rating', RatingSchema);
