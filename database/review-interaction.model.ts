import { Schema, Document, model, models, Types } from 'mongoose';

export interface IReviewInteraction {
  author: Types.ObjectId;
  reviewId: Types.ObjectId;
  type: 'like' | 'dislike' | 'share' | 'report';
}

export interface IReviewInteractionDoc extends IReviewInteraction, Document {}

export interface ReviewInteractionCounts {
  like: number;
  dislike: number;
  share: number;
  report: number;
}

const InteractionSchema = new Schema<IReviewInteraction>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike', 'share', 'report'],
      required: true,
    },
  },
  { timestamps: true }
);

// Index for mutually exclusive interactions (like/dislike)
InteractionSchema.index(
  { author: 1, reviewId: 1 },
  {
    unique: true,
    partialFilterExpression: { type: { $in: ['like', 'dislike'] } },
  }
);

// Index for counting interactions by type
InteractionSchema.index({ reviewId: 1, type: 1 });

const ReviewInteraction =
  models?.ReviewInteraction ||
  model<IReviewInteraction>('ReviewInteraction', InteractionSchema);

export default ReviewInteraction;
