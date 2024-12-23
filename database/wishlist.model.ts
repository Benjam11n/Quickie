import { Schema, Document, models, model, Types } from 'mongoose';

export interface WishlistPerfume {
  perfumeId: Types.ObjectId;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  priceAlert?: number;
  addedAt: Date;
}
export interface IWishlist {
  name: string;
  author: Types.ObjectId;
  perfumes: Array<WishlistPerfume>;
}

export interface IWishlistDoc extends IWishlist, Document {}

const WishlistSchema = new Schema<IWishlistDoc>(
  {
    name: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    perfumes: [
      {
        perfumeId: {
          type: Schema.Types.ObjectId,
          ref: 'Perfume',
          required: true,
        },
        notes: { type: String, trim: true },
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
        priceAlert: { type: Number, min: 0 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate perfumes for a user
WishlistSchema.index({ author: 1, 'perfumes.perfumeId': 1 }, { unique: true });

// Useful indexes for querying
WishlistSchema.index({ author: 1 });
WishlistSchema.index({ 'perfumes.priority': 1 });
WishlistSchema.index({ 'perfumes.addedAt': -1 });

// Add virtual for total items
WishlistSchema.virtual('totalItems').get(function () {
  return this.perfumes.length;
});

// Instance methods
WishlistSchema.methods.addPerfume = async function (
  perfumeId: Types.ObjectId,
  options?: {
    notes?: string;
    priority?: 'low' | 'medium' | 'high';
    priceAlert?: number;
  }
) {
  const exists = this.perfumes.some(
    (p: WishlistPerfume) => p.perfumeId.toString() === perfumeId.toString()
  );

  if (exists) {
    throw new Error('Perfume already in wishlist');
  }

  this.perfumes.push({
    perfumeId,
    ...options,
    addedAt: new Date(),
  });

  return this.save();
};

WishlistSchema.methods.removePerfume = async function (
  perfumeId: Types.ObjectId
) {
  this.perfumes = this.perfumes.filter(
    (p: WishlistPerfume) => p.perfumeId.toString() !== perfumeId.toString()
  );
  return this.save();
};

// Static methods
WishlistSchema.statics.findByUserAndPerfume = async function (
  author: Types.ObjectId,
  perfumeId: Types.ObjectId
) {
  return this.findOne({
    author,
    'perfumes.perfumeId': perfumeId,
  });
};

const Wishlist =
  models?.Wishlist || model<IWishlistDoc>('Wishlist', WishlistSchema);

export default Wishlist;
