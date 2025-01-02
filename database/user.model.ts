/* eslint-disable no-unused-vars */
import { Schema, Document, models, model, Types } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

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
    perfume: Types.ObjectId;
    date: Date;
    rating: number;
    review?: string;
  }>;
  wishlist: Types.ObjectId[];

  role: UserRole;
  isPrivate: boolean;
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
    isPrivate: { type: Boolean, default: false, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { timestamps: true }
);

const User = models?.User || model<IUserDoc>('User', UserSchema);

UserSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export default User;
