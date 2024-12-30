import { model, models, Schema, Document, Types } from 'mongoose';

export interface INote {
  name: string;
  perfumes: number;
  family: Types.ObjectId;
  description?: string;
}

export interface INoteDoc extends INote, Document {}

const NoteSchema = new Schema<INote>(
  {
    name: { type: String, required: true, unique: true, index: true },
    perfumes: { type: Number, default: 0, min: 0 },
    family: {
      type: Schema.Types.ObjectId,
      ref: 'NoteFamily',
      required: true,
    },
    description: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

const Note = models?.Note || model<INote>('Note', NoteSchema);

export default Note;
