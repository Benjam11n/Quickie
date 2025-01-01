import { Schema, Document, Types, models, model } from 'mongoose';

interface IPerfumePosition {
  perfume: Types.ObjectId;
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
  dimensions: { layout: string; cols: number; rows: number };
}

export interface IMoodBoardDoc extends IMoodBoard, Document {
  _id: Types.ObjectId;
}

const BoardDimensionsSchema = new Schema({
  layout: {
    type: String,
    enum: ['grid3x3', 'grid2x4', 'grid4x2', 'pinterest'],
    default: 'grid3x3',
  },
  cols: {
    type: Number,
    required: true,
    default: 3,
  },
  rows: {
    type: Number,
    required: true,
    default: 3,
  },
});

const MoodBoardSchema = new Schema<IMoodBoard>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    perfumes: [
      {
        perfume: {
          type: Schema.Types.ObjectId,
          ref: 'Perfume',
          required: true,
        },
        position: {
          x: {
            type: Number,
            required: true,
            min: 0,
          },
          y: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      },
    ],
    tags: [{ type: String, trim: true }],
    isPublic: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dimensions: {
      type: BoardDimensionsSchema,
      required: true,
      default: {
        layout: 'grid3x3',
        cols: 3,
        rows: 3,
      },
    },
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

export default MoodBoard;
