import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  perfumeId: mongoose.Types.ObjectId;
  vendingMachineId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  tags: string[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  perfumeId: {
    type: Schema.Types.ObjectId,
    ref: 'Perfume',
    required: true
  },
  vendingMachineId: {
    type: Schema.Types.ObjectId,
    ref: 'VendingMachine',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Review must be at least 10 characters long']
  },
  tags: [String],
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create compound indexes
ReviewSchema.index({ perfumeId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, perfumeId: 1 }, { unique: true });

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);