import { Schema, Document, Types, models, model } from 'mongoose';

interface IPerfumePosition {
  perfumeId: Types.ObjectId;
  position: {
    x: number;
    y: number;
  };
}

export interface IMoodBoard {
  author: Types.ObjectId;
  name: string;
  description?: string;
  perfumes: IPerfumePosition[];
  tags: string[];
  isPublic: boolean;
  views?: number;
  likes?: number;
}

export interface IMoodBoardDoc extends IMoodBoard, Document {
  _id: Types.ObjectId;
}

const MoodBoardSchema = new Schema<IMoodBoard>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    perfumes: [
      {
        perfumeId: {
          type: Schema.Types.ObjectId,
          ref: 'Perfume',
          required: true,
        },
        position: {
          x: {
            type: Number,
            required: true,
            min: 0,
            max: 2, // For 3x3 grid
          },
          y: {
            type: Number,
            required: true,
            min: 0,
            max: 2,
          },
        },
      },
    ],
    tags: [{ type: String, trim: true }],
    isPublic: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for efficient querying
MoodBoardSchema.index({ author: 1 });
MoodBoardSchema.index({ isPublic: 1 });
MoodBoardSchema.index({ tags: 1 });

// Prevent duplicate perfumes in the same position
MoodBoardSchema.index(
  { 'perfumes.position.x': 1, 'perfumes.position.y': 1 },
  { unique: true, sparse: true }
);

const MoodBoard =
  models?.MoodBoard || model<IMoodBoard>('MoodBoard', MoodBoardSchema);

// export const Review = models.Review || model<IReview>('Review', ReviewSchema);
export default MoodBoard;
