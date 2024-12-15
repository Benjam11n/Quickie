import { hash } from 'bcryptjs';
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAccount {
  userId: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  provider: string;
  providerAccountId?: string;
}

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccountDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      select: false,
    },
    provider: {
      type: String,
      required: true,
      default: 'credentials',
    },
    providerAccountId: String,
  },
  { timestamps: true }
);

AccountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password!, 12);
  }
  next();
});

const Account = models?.Account || model<IAccountDoc>('Account', AccountSchema);
export default Account;
