import { models, Schema, Document, Types, model } from 'mongoose';

export interface IPerfume {
  name: string;
  brand: Types.ObjectId;
  description: string;
  affiliateLink: string;
  images: string[];
  notes: {
    top: {
      note: Types.ObjectId;
      intensity: number;
      noteFamily: Types.ObjectId;
    }[];
    middle: {
      note: Types.ObjectId;
      intensity: number;
      noteFamily: Types.ObjectId;
    }[];
    base: {
      note: Types.ObjectId;
      intensity: number;
      noteFamily: Types.ObjectId;
    }[];
  };
  scentProfile: {
    intensity: number;
    longevity: number;
    sillage: number;
    versatility: number;
    uniqueness: number;
    value: number;
  };
  fullPrice: number;
  size: number;
  rating: {
    average: number;
    count: number;
  };
  tags: Types.ObjectId[];
  author: Types.ObjectId;
  seasonalCompatibility: {
    summer: number;
    fall: number;
    winter: number;
    spring: number;
  };
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface IPerfumeDoc extends IPerfume, Document {}

const PerfumeSchema = new Schema<IPerfume>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      index: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      required: [true, 'Brand is required'],
      ref: 'Brand',
    },
    description: {
      type: String,
      required: true,
    },
    affiliateLink: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    notes: {
      top: [
        {
          note: {
            type: Schema.Types.ObjectId,
            ref: 'Note',
            required: true,
          },
          intensity: { type: Number, min: 0, max: 100 },
        },
      ],
      middle: [
        {
          note: {
            type: Schema.Types.ObjectId,
            ref: 'Note',
            required: true,
          },
          intensity: { type: Number, min: 0, max: 100 },
        },
      ],
      base: [
        {
          note: {
            type: Schema.Types.ObjectId,
            ref: 'Note',
            required: true,
          },
          intensity: { type: Number, min: 0, max: 100 },
        },
      ],
    },
    scentProfile: {
      intensity: {
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
      sillage: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      versatility: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      uniqueness: {
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
    fullPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    seasonalCompatibility: {
      summer: { type: Number, default: 0, min: 0, max: 100 },
      fall: { type: Number, default: 0, min: 0, max: 100 },
      winter: { type: Number, default: 0, min: 0, max: 100 },
      spring: { type: Number, default: 0, min: 0, max: 100 },
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Rating distribution
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },

    // Rating
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        immutable: true,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
        immutable: true,
      },
    },
  },
  { timestamps: true }
);

PerfumeSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text',
});

PerfumeSchema.index({ brand: 1, name: 1 });

const Perfume = models?.Perfume || model<IPerfume>('Perfume', PerfumeSchema);

export default Perfume;
