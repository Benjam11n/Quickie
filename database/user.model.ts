import { Schema, Document, models, model, Types } from 'mongoose';

export interface IUser {
  name: string;
  username: string;
  bio?: string;
  preferences: {
    favoriteNotes: string[];
    dislikedNotes: string[];
  };
  triedPerfumes: Array<{
    perfumeId: Types.ObjectId;
    date: Date;
    rating: number;
    review?: string;
  }>;
  wishlist: Types.ObjectId[];
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    preferences: {
      favoriteNotes: [String],
      dislikedNotes: [String],
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Perfume',
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({ username: 1 });

const User = models?.User || model<IUserDoc>('User', UserSchema);

export default User;
