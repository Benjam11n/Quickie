import { models, Schema, Document, Types, model } from 'mongoose';

export interface IPerfume {
  name: string;
  brand: Types.ObjectId;
  description: string;
  affiliateLink: string;
  images: string[];
  notes: {
    top: Types.ObjectId[];
    middle: Types.ObjectId[];
    base: Types.ObjectId[];
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
  rating: {
    average: number;
    count: number;
  };
  tags: Types.ObjectId[];
  author: Types.ObjectId;
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
      top: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
      middle: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
      base: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
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
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Create text index for search
PerfumeSchema.index({
  name: 'text',
  brand: 'text',
  'notes.top': 'text',
  'notes.middle': 'text',
  'notes.base': 'text',
});

// PerfumeSchema.post('save', async function () {
//   await Promise.all(
//     this.tags.map((tagId) =>
//       Tag.findByIdAndUpdate(tagId, {
//         $inc: { perfumesCount: 1 },
//       })
//     )
//   );
// });

// PerfumeSchema.post(
//   'deleteOne',
//   { document: true, query: false },
//   async function () {
//     await Promise.all(
//       this.tags.map((tagId: Types.ObjectId) =>
//         Tag.findByIdAndUpdate(tagId, {
//           $inc: { perfumesCount: -1 },
//         })
//       )
//     );
//   }
// );

// // Handle bulk operations
// PerfumeSchema.pre('deleteMany', async function () {
//   // Get affected perfumes and their tags
//   const perfumes = await this.model.find(this.getQuery());

//   // Count occurrences of each tag
//   const tagCounts = perfumes.reduce(
//     (acc, perfume) => {
//       perfume.tags.forEach((tagId: Types.ObjectId) => {
//         acc[tagId.toHexString()] = (acc[tagId.toHexString()] || 0) + 1;
//       });
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   // Update all affected tags
//   await Promise.all(
//     Object.entries(tagCounts).map(([tagId, count]) =>
//       Tag.findByIdAndUpdate(tagId, {
//         $inc: { perfumesCount: -(count as number) },
//       })
//     )
//   );
// });

const Perfume = models?.Perfume || model<IPerfume>('Perfume', PerfumeSchema);

export default Perfume;
