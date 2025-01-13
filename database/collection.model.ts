import { Schema, model, models, Types } from 'mongoose';

interface ICollection {
  author: Types.ObjectId;
  perfumes: Array<{
    perfume: Types.ObjectId;
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
        perfume: {
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
CollectionSchema.index({ 'perfumes.perfume': 1 });

CollectionSchema.methods.addPerfume = async function (perfume: Types.ObjectId) {
  const exists = this.perfumes.some(
    (p: { perfume: Types.ObjectId; addedAt: Date }) =>
      p.perfume.toString() === perfume.toString()
  );

  if (exists) {
    throw new Error('Perfume already in collection');
  }

  this.perfumes.push({
    perfume,
    addedAt: new Date(),
  });

  return this.save();
};

CollectionSchema.methods.removePerfume = async function (
  perfume: Types.ObjectId
) {
  this.perfumes = this.perfumes.filter(
    (p: { perfume: Types.ObjectId; addedAt: Date }) =>
      p.perfume.toString() !== perfume.toString()
  );
  return this.save();
};

const Collection =
  models?.Collection || model<ICollection>('Collection', CollectionSchema);
export default Collection;
