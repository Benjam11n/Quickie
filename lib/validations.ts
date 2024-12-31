import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(30, { message: 'Username cannot exceed 30 characters.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),

  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name can only contain letters and spaces.',
    }),

  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please provide a valid email address.' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  bio: z.string().optional(),
  image: z.string().url({ message: 'Please provide a valid URL.' }).optional(),
  location: z.string().optional(),
  isPrivate: z.boolean().optional(),
  portfolio: z
    .string()
    .url({ message: 'Please provide a valid URL.' })
    .optional(),
  reputation: z.number().optional(),
});

export const UpdateUserSchema = UserSchema.omit({
  bio: true,
  location: true,
  portfolio: true,
  reputation: true,
}).extend({
  userId: z.string().min(1, { message: 'User ID is required.' }),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .optional(),
  provider: z.string().min(1, { message: 'Provider is required.' }),
  providerAccountId: z
    .string()
    .min(1, { message: 'Provider Account ID is required.' }),
});

export const UpdateAccountSchema = AccountSchema.omit({
  provider: true,
  providerAccountId: true,
  password: true,
}).extend({
  oldPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(['google', 'github']),
  providerAccountId: z
    .string()
    .min(1, { message: 'Provider Account ID is required.' }),
  user: z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long.' }),
    email: z
      .string()
      .email({ message: 'Please provide a valid email address.' }),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

// Perfume positions
export const PerfumePositionSchema = z.object({
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
  position: z.object({
    x: z
      .number()
      .min(0, { message: 'X position cannot be negative.' })
      .max(100, { message: 'X position cannot exceed 100.' }),
    y: z
      .number()
      .min(0, { message: 'Y position cannot be negative.' })
      .max(100, { message: 'Y position cannot exceed 100.' }),
  }),
});

// Sub-schemas
const ScentProfileSchema = z.object({
  intensity: z
    .number()
    .min(0, { message: 'Intensity cannot be below 0.' })
    .max(10, { message: 'Intensity cannot exceed 10.' }),
  longevity: z
    .number()
    .min(0, { message: 'Longevity cannot be below 0.' })
    .max(10, { message: 'Longevity cannot exceed 10.' }),
  sillage: z
    .number()
    .min(0, { message: 'Sillage cannot be below 0.' })
    .max(10, { message: 'Sillage cannot exceed 10.' }),
  versatility: z
    .number()
    .min(0, { message: 'Versatility cannot be below 0.' })
    .max(10, { message: 'Versatility cannot exceed 10.' }),
  uniqueness: z
    .number()
    .min(0, { message: 'Uniqueness cannot be below 0.' })
    .max(10, { message: 'Uniqueness cannot exceed 10.' }),
  value: z
    .number()
    .min(0, { message: 'Value cannot be below 0.' })
    .max(10, { message: 'Value cannot exceed 10.' }),
});

const NotesSchema = z.object({
  top: z
    .array(z.string())
    .max(10, { message: 'Cannot have more than 10 top notes.' }),
  middle: z
    .array(z.string())
    .max(10, { message: 'Cannot have more than 10 middle notes.' }),
  base: z
    .array(z.string())
    .max(10, { message: 'Cannot have more than 10 base notes.' }),
});

const RatingSchema = z.object({
  average: z
    .number()
    .min(0, { message: 'Average rating cannot be below 0.' })
    .max(5, { message: 'Average rating cannot exceed 5.' })
    .default(0),
  count: z
    .number()
    .nonnegative({ message: 'Rating count cannot be negative.' })
    .default(0),
});

// Main Perfume Schema
export const PerfumeSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' }),

  brand: z.string().min(1, { message: 'Brand is required.' }),

  description: z
    .string()
    .min(1, { message: 'Description is required.' })
    .max(2000, { message: 'Description cannot exceed 2000 characters.' }),

  affiliateLink: z.string().url({ message: 'Please provide a valid URL.' }),

  images: z
    .array(z.string().url({ message: 'Please provide valid image URLs.' }))
    .min(1, { message: 'At least one image is required.' })
    .max(10, { message: 'Cannot have more than 10 images.' }),

  notes: NotesSchema,

  scentProfile: ScentProfileSchema,

  price: z.number().positive({ message: 'Price must be greater than 0.' }),

  rating: RatingSchema,

  tags: z
    .array(z.string())
    .max(20, { message: 'Cannot have more than 20 tags.' }),
});

// Create Schema (subset of fields that are required when creating)
export const CreatePerfumeSchema = PerfumeSchema.omit({
  rating: true,
});

// Update Schema (all fields optional)
export const UpdatePerfumeSchema = PerfumeSchema.extend({
  perfumeId: z.string().min(1, { message: 'Perfume ID is required.' }),
});

// Rating Schema for user ratings
export const PerfumeRatingSchema = z.object({
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
  rating: z
    .number()
    .min(1, { message: 'Rating must be at least 1.' })
    .max(5, { message: 'Rating cannot exceed 5.' }),
  review: z
    .string()
    .max(1000, { message: 'Review cannot exceed 1000 characters.' })
    .optional(),
});

export const GetPerfumeSchema = z.object({
  perfumeId: z.string().min(1, { message: 'Perfume ID is required.' }),
});

export const GetPerfumesByIdsSchema = z.object({
  perfumeIds: z.array(
    z.string().min(1, { message: 'Perfume ID is required.' })
  ),
});

const LocationSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90), // latitude
  ]),
  address: z.string().min(1, { message: 'Address is required.' }),
  area: z.string().min(1, { message: 'Area is required.' }),
});

const InventoryItemSchema = z.object({
  perfume: z.string(),
  stock: z.number().int().min(0),
  lastRefilled: z.date(),
});

const MetricsSchema = z.object({
  totalSamples: z.number().int().min(0),
  popularTimes: z.record(z.string(), z.number()),
});

export const VendingMachineSchema = z.object({
  location: LocationSchema,
  inventory: z.array(InventoryItemSchema),
  status: z.enum(['active', 'maintenance', 'inactive']),
  metrics: MetricsSchema,
});

export const CreateVendingMachineSchema = VendingMachineSchema;

export const UpdateVendingMachineSchema = CreateVendingMachineSchema.extend({
  vendingMachineId: z
    .string()
    .min(1, { message: 'Vending Machine ID is required.' }),
});

export const GetVendingMachineSchema = z.object({
  vendingMachineId: z
    .string()
    .min(1, { message: 'Vending Machine ID is required.' }),
});

// Main MoodBoard schema
export const MoodBoardSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Board name is required.' })
    .max(50, { message: 'Board name cannot exceed 50 characters.' }),

  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters.' })
    .optional(),

  perfumes: z.array(PerfumePositionSchema).default([]),

  tags: z
    .array(z.string().max(30, { message: 'Tag cannot exceed 30 characters.' }))
    .max(10, { message: 'Cannot have more than 10 tags.' }),

  isPublic: z.boolean(),

  views: z
    .number()
    .nonnegative({ message: 'Views cannot be negative.' })
    .default(0)
    .optional(),

  likes: z
    .number()
    .nonnegative({ message: 'Likes cannot be negative.' })
    .default(0)
    .optional(),
});

// Schema for creating a new moodboard (subset of fields)
export const CreateMoodBoardSchema = MoodBoardSchema.pick({
  name: true,
  description: true,
  tags: true,
  isPublic: true,
});

// Schema for updating a moodboard
export const UpdateMoodBoardSchema = MoodBoardSchema.extend({
  boardId: z.string().min(1, { message: 'Board ID is required.' }),
});

// Schema for updating perfume position
export const UpdatePerfumePositionSchema = z.object({
  boardId: z.string().min(1, { message: 'Board ID is required.' }),
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
  position: z.object({
    x: z
      .number()
      .min(0, { message: 'X position cannot be negative.' })
      .max(100, { message: 'X position cannot exceed 100.' }),
    y: z
      .number()
      .min(0, { message: 'Y position cannot be negative.' })
      .max(100, { message: 'Y position cannot exceed 100.' }),
  }),
});

export const GetMoodBoardSchema = z.object({
  boardId: z.string().min(1, { message: 'Mood Board ID is required.' }),
});

const ReviewRatingSchema = z.object({
  sillage: z.number().min(1).max(5),
  longevity: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  uniqueness: z.number().min(1).max(5),
  complexity: z.number().min(1).max(5),
});

// Create Review Schema
export const CreateReviewSchema = z.object({
  perfume: z.string(),
  vendingMachineId: z.string().optional(),
  rating: ReviewRatingSchema,
  review: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .trim(),
});

export const UpdateReviewSchema = CreateReviewSchema.extend({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
});

export const DeleteReviewSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
});

export const ReviewInteractionSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
  type: z.enum(['like', 'dislike', 'share', 'report']),
});

export const GetReviewInteractionsSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
});

export const LikeReviewSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
});

// Get Review Schema
export const GetReviewSchema = z.object({
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
  userId: z.string().min(1, { message: 'User ID is required.' }),
});

export const GetUserReviewsSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
});

export const GetPerfumeReviewsSchema = z.object({
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(12).optional(),
  query: z.string().optional(),
  brand: z.string().optional(),
  priceRange: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
  sort: z.string().optional(),
});

export const CreateWishlistSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z
    .string()
    .max(2000, { message: 'Description cannot exceed 2000 characters.' })
    .optional(),
});

export const UpdateWishlistSchema = CreateWishlistSchema.extend({
  wishlistId: z.string().min(1, { message: 'Wishlist ID is required.' }),
});

export const DeleteWishlistSchema = z.object({
  wishlistId: z.string().min(1, { message: 'Wishlist ID is required.' }),
});

export const GetWishlistSchema = z.object({
  wishlistId: z.string().min(1, { message: 'Wishlist ID is required.' }),
});

export const GetUserWishlistsSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
});

export const AddToWishlistSchema = z.object({
  wishlistId: z.string().min(1, { message: 'Wishlist ID is required.' }),
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  // priceAlert: z.number().min(0).optional(),
});

export const RemoveFromWishlistSchema = AddToWishlistSchema;

export const AddToCollectionSchema = z.object({
  perfume: z.string().min(1, { message: 'Perfume ID is required.' }),
});

export const RemoveFromCollectionSchema = AddToCollectionSchema;

export const GetCollectionSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
});

export const CreateWaitlistSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address.' }),
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name can only contain letters and spaces.',
    }),
});

export const GetWaitlistSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address.' }),
});

export const NotifyWaitlistSchema = z.object({
  emails: z.array(
    z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please provide a valid email address.' })
  ),
});

export const VerifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address.' }),
  token: z.string().min(1, { message: 'Token is required' }),
});
