import { model, models, Schema, Types, Document } from 'mongoose';

export interface ITagPerfume {
  tag: Types.ObjectId;
  perfume: Types.ObjectId;
}

export interface ITagPerfumeDoc extends ITagPerfume, Document {}

const TagPerfumeSchema = new Schema<ITagPerfume>(
  {
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
    },
    perfume: {
      type: Schema.Types.ObjectId,
      ref: 'Perfume',
      required: true,
    },
  },
  { timestamps: true }
);

// Add compound index to prevent duplicate tag-perfume combinations
TagPerfumeSchema.index({ tag: 1, perfume: 1 }, { unique: true });

const TagPerfume =
  models?.TagPerfume || model<ITagPerfume>('TagPerfume', TagPerfumeSchema);

export default TagPerfume;
