import { Schema, Document, models, model, Types } from 'mongoose';

export interface IWishlist {
  userId: Types.ObjectId;
  perfumeId: Types.ObjectId;
  dateAdded: Date;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  priceAlert?: number; // Price point at which to notify user
}

export interface IWishlistDoc extends IWishlist, Document {}

const WishlistSchema = new Schema<IWishlistDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    perfumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Perfume',
      required: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    priceAlert: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

// Ensure a user can't add the same perfume twice
WishlistSchema.index({ userId: 1, perfumeId: 1 }, { unique: true });

// Add useful indexes for querying
WishlistSchema.index({ userId: 1, priority: 1 });
WishlistSchema.index({ userId: 1, dateAdded: -1 });

const Wishlist =
  models?.Wishlist || model<IWishlistDoc>('Wishlist', WishlistSchema);

export default Wishlist;
