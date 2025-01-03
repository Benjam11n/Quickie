import { Schema, model, models, Document } from 'mongoose';

export interface IBrand {
  name: string;
  perfumesCount: number;
}

export interface IBrandDoc extends IBrand, Document {}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    perfumesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Brand = models?.Brand || model<IBrand>('Brand', BrandSchema);

export default Brand;
