import { Schema, Document, model, models, Types } from 'mongoose';

export interface IReviewInteraction {
  user: Types.ObjectId;
  review: Types.ObjectId;
  type: 'like' | 'dislike' | 'share' | 'report';
}

export interface IReviewInteractionDoc extends IReviewInteraction, Document {}

const InteractionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike', 'share', 'report'],
      required: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

InteractionSchema.index({ user: 1, review: 1, type: 1 }, { unique: true });
InteractionSchema.index({ review: 1, type: 1 });

const ReviewInteraction =
  models?.Interaction ||
  model<IReviewInteraction>('ReviewInteraction', InteractionSchema);
export default ReviewInteraction;
