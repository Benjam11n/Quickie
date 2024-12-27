import { Schema, model, models, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  perfumesCount: number;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    perfumesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Brand = models?.Brand || model<IBrand>('Brand', BrandSchema);

export default Brand;
