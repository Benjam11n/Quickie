import { Schema, Document, models, model, Types } from 'mongoose';

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  reputation?: number;
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
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    reputation: { type: Number, default: 0 },
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

const User = models?.User || model<IUserDoc>('User', UserSchema);

export default User;
