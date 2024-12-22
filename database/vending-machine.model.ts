import { Schema, Document, models, model, Types } from 'mongoose';

export interface IVendingMachine {
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    area: string;
  };
  inventory: Array<{
    perfumeId: Types.ObjectId;
    stock: number;
    lastRefilled: Date;
  }>;
  status: 'active' | 'maintenance' | 'inactive';
  metrics: {
    totalSamples: number;
    popularTimes: Record<string, number>;
  };
  author: Types.ObjectId;
}

export interface IVendingMachineDoc extends IVendingMachine, Document {}

const VendingMachineSchema = new Schema<IVendingMachine>(
  {
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true, trim: true },
      area: { type: String, required: true, trim: true },
    },
    inventory: [
      {
        perfumeId: {
          type: Schema.Types.ObjectId,
          ref: 'Perfume',
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
        lastRefilled: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
    metrics: {
      totalSamples: { type: Number, default: 0 },
      popularTimes: { type: Map, of: Number, default: {} },
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Create geospatial index
VendingMachineSchema.index({ location: '2dsphere' });

const VendingMachine =
  models?.VendingMachine ||
  model<IVendingMachine>('VendingMachine', VendingMachineSchema);

export default VendingMachine;
