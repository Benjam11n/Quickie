import mongoose, { Schema, Document } from "mongoose";

export interface IVendingMachine extends Document {
  location: {
    type: "Point";
    coordinates: [number, number];
    address: string;
    area: string;
  };
  inventory: Array<{
    perfumeId: mongoose.Types.ObjectId;
    stock: number;
    lastRefilled: Date;
  }>;
  status: "active" | "maintenance" | "inactive";
  metrics: {
    totalSamples: number;
    popularTimes: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VendingMachineSchema = new Schema<IVendingMachine>(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
    },
    inventory: [
      {
        perfumeId: {
          type: Schema.Types.ObjectId,
          ref: "Perfume",
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
        lastRefilled: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    metrics: {
      totalSamples: {
        type: Number,
        default: 0,
      },
      popularTimes: {
        type: Map,
        of: Number,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index
VendingMachineSchema.index({ location: "2dsphere" });

export const VendingMachine =
  mongoose.models.VendingMachine ||
  mongoose.model<IVendingMachine>("VendingMachine", VendingMachineSchema);
