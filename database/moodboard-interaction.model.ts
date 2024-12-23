import { Schema, Document, model, models, Types } from 'mongoose';

export interface IMoodBoardInteraction {
  userId: Types.ObjectId;
  boardId: Types.ObjectId;
  type: 'like' | 'dislike' | 'share' | 'report';
}

export interface IMoodBoardInteractionDoc
  extends IMoodBoardInteraction,
    Document {}

const MoodBoardInteractionSchema = new Schema<IMoodBoardInteraction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'MoodBoard',
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

// Compound index to prevent duplicate interactions
MoodBoardInteractionSchema.index(
  { userId: 1, boardId: 1, type: 1 },
  { unique: true }
);

const MoodBoardInteraction =
  models?.MoodBoardInteraction ||
  model<IMoodBoardInteraction>(
    'MoodBoardInteraction',
    MoodBoardInteractionSchema
  );

export default MoodBoardInteraction;
