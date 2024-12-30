import { Schema, model, models, Document } from 'mongoose';

export interface INoteFamily {
  name: string;
  color: string;
  perfumesCount: number;
}

export interface INoteFamilyDoc extends INoteFamily, Document {}

const NoteFamilySchema = new Schema<INoteFamily>(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String },
    perfumesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const NoteFamily =
  models?.NoteFamily || model<INoteFamily>('NoteFamily', NoteFamilySchema);

export default NoteFamily;
