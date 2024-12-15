import { model, models, Schema, Document } from 'mongoose';

export interface IBrand {
  name: string;
  perfumes: number;
}

export interface IBrandDoc extends IBrand, Document {}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    perfumes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Brand = models?.Brand || model<IBrand>('Brand', BrandSchema);

export default Brand;
