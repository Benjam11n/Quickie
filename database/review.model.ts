import { Schema, Document, model, models, Types } from 'mongoose';

import { Rating } from '@/types/models/fragrance';

export interface IReview {
  author: Types.ObjectId;
  perfume: Types.ObjectId;
  vendingMachineId?: Types.ObjectId;
  rating: Rating;
  review?: string;
}

export interface IReviewDoc extends IReview, Document {}

const ReviewSchema = new Schema<IReview>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    perfume: {
      type: Schema.Types.ObjectId,
      ref: 'Perfume',
      required: true,
    },
    vendingMachineId: {
      type: Schema.Types.ObjectId,
      ref: 'VendingMachine',
      required: false,
    },
    rating: {
      sillage: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      longevity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      uniqueness: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      complexity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    review: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create compound indexes
ReviewSchema.index({ perfume: 1, createdAt: -1 });
ReviewSchema.index({ author: 1, perfume: 1 }, { unique: true });

const Review = models?.Review || model<IReview>('Review', ReviewSchema);

export default Review;
