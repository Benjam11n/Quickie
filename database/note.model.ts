import { model, models, Schema, Document } from 'mongoose';

export interface INote {
  name: string;
  perfumes: number;
}

export interface INoteDoc extends INote, Document {}

const NoteSchema = new Schema<INote>(
  {
    name: { type: String, required: true, unique: true },
    perfumes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Note = models?.Note || model<INote>('Note', NoteSchema);

export default Note;
