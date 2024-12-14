import mongoose, { Schema, Document } from "mongoose";

export interface IPerfume extends Document {
  name: string;
  brand: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  characteristics: {
    sillage: number;
    longevity: number;
    value: number;
  };
  samplePrice: number;
  fullPrice: number;
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PerfumeSchema = new Schema<IPerfume>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      index: true,
    },
    notes: {
      top: [{ type: String, trim: true }],
      middle: [{ type: String, trim: true }],
      base: [{ type: String, trim: true }],
    },
    characteristics: {
      sillage: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      longevity: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      value: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
    },
    samplePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    fullPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Create text index for search
PerfumeSchema.index({
  name: "text",
  brand: "text",
  "notes.top": "text",
  "notes.middle": "text",
  "notes.base": "text",
});

export const Perfume =
  mongoose.models.Perfume || mongoose.model<IPerfume>("Perfume", PerfumeSchema);
