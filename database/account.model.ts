import { Types, Schema, Document, models, model } from 'mongoose';

export interface IAccount {
  userId: Types.ObjectId;
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
    password: { type: String, select: false },
    provider: {
      type: String,
      required: true,
      default: 'credentials',
    },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true }
);

const Account = models?.Account || model<IAccountDoc>('Account', AccountSchema);

export default Account;
