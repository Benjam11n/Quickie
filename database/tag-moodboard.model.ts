import { model, models, Schema, Types, Document } from 'mongoose';

export interface ITagMoodBoard {
  tag: Types.ObjectId;
  moodboard: Types.ObjectId;
}

export interface ITagMoodBoardDoc extends ITagMoodBoard, Document {}
const TagMoodBoardSchema = new Schema<ITagMoodBoard>(
  {
    tag: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
    moodboard: {
      type: Schema.Types.ObjectId,
      ref: 'MoodBoard',
      required: true,
    },
  },
  { timestamps: true }
);

const TagMoodBoard =
  models?.TagMoodBoard ||
  model<ITagMoodBoard>('TagMoodBoard', TagMoodBoardSchema);

export default TagMoodBoard;
