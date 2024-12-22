import { Schema, Document, model, models, Types } from 'mongoose';

export interface IInteraction extends Document {
  user: Types.ObjectId;
  review: Types.ObjectId;
  type: 'like' | 'share' | 'report';
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

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
      enum: ['like', 'share', 'report'],
      required: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

InteractionSchema.index({ user: 1, review: 1, type: 1 }, { unique: true });
InteractionSchema.index({ review: 1, type: 1 });

const Interaction =
  models?.Interaction || model<IInteraction>('Interaction', InteractionSchema);
export default Interaction;
