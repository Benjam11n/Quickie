import { Schema, Document, model, models, Types } from 'mongoose';

export interface IFollow {
  follower: Types.ObjectId;
  following: Types.ObjectId;
}

export interface IFollowDoc extends IFollow, Document {}

const FollowSchema = new Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = models?.Follow || model<IFollow>('Follow', FollowSchema);

export default Follow;
