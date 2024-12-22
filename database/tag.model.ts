import { Document, Schema, model, models } from 'mongoose';

export interface ITag {
  name: string;
  type: 'perfume' | 'moodboard';
  count: number;
}

export interface ITagDoc extends ITag, Document {}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['perfume', 'moodboard'],
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for unique tag names within each type
TagSchema.index({ name: 1, type: 1 }, { unique: true });

const Tag = models?.Tag || model<ITag>('Tag', TagSchema);

export default Tag;
