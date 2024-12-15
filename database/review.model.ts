import { Schema, Document, model, models, Types } from 'mongoose';

export interface IReview extends Document {
  userId: Types.ObjectId;
  perfumeId: Types.ObjectId;
  vendingMachineId?: Types.ObjectId;
  rating: {
    sillage: number;
    longevity: number;
    value: number;
    projection: number;
    complexity: number;
  };
  review: string;
  // tags: string[];
  likes: number;
}

const ReviewSchema = new Schema<IReview>(
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
    vendingMachineId: {
      type: Schema.Types.ObjectId,
      ref: 'VendingMachine',
      required: false, // Changed to match interface
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
      projection: {
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
      required: true,
      trim: true,
      minlength: [10, 'Review must be at least 10 characters long'],
    },
    // tags: [String],
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create compound indexes
ReviewSchema.index({ perfumeId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, perfumeId: 1 }, { unique: true });

const Review = models?.Review || model<IReview>('Review', ReviewSchema);

export default Review;
