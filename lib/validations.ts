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
  portfolio: z
    .string()
    .url({ message: 'Please provide a valid URL.' })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  image: z.string().url({ message: 'Please provide a valid URL.' }).optional(),
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
  perfumeId: z.string().min(1, { message: 'Perfume ID is required.' }),
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
  perfumeId: z.string().min(1, { message: 'Perfume ID is required.' }),
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

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
