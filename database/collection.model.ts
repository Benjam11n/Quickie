// models/Collection.ts
import { Schema, model, models, Types } from 'mongoose';

interface ICollection {
  author: Types.ObjectId;
  perfumes: Array<{
    perfumeId: Types.ObjectId;
    addedAt: Date;
  }>;
}

export interface ICollectionDoc extends ICollection, Document {}

const CollectionSchema = new Schema<ICollection>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    perfumes: [
      {
        perfumeId: {
          type: Schema.Types.ObjectId,
          ref: 'Perfume',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create index for faster lookups
CollectionSchema.index({ 'perfumes.perfumeId': 1 });

CollectionSchema.methods.addPerfume = async function (
  perfumeId: Types.ObjectId
) {
  const exists = this.perfumes.some(
    (p: { perfumeId: Types.ObjectId; addedAt: Date }) =>
      p.perfumeId.toString() === perfumeId.toString()
  );

  if (exists) {
    throw new Error('Perfume already in wishlist');
  }

  this.perfumes.push({
    perfumeId,
    addedAt: new Date(),
  });

  return this.save();
};

CollectionSchema.methods.removePerfume = async function (
  perfumeId: Types.ObjectId
) {
  this.perfumes = this.perfumes.filter(
    (p: { perfumeId: Types.ObjectId; addedAt: Date }) =>
      p.perfumeId.toString() !== perfumeId.toString()
  );
  return this.save();
};

const Collection =
  models?.Collection || model<ICollection>('Collection', CollectionSchema);
export default Collection;
