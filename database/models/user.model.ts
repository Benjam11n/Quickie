import { hash } from "bcryptjs";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  profile: {
    name: string;
    avatar?: string;
    preferences: {
      favoriteNotes: string[];
      dislikedNotes: string[];
    };
  };
  history: {
    triedPerfumes: Array<{
      perfumeId: mongoose.Types.ObjectId;
      date: Date;
      rating: number;
      review?: string;
    }>;
    wishlist: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    profile: {
      name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
      },
      avatar: String,
      preferences: {
        favoriteNotes: [String],
        dislikedNotes: [String],
      },
    },
    history: {
      triedPerfumes: [
        {
          perfumeId: {
            type: Schema.Types.ObjectId,
            ref: "Perfume",
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          rating: {
            type: Number,
            min: 1,
            max: 5,
          },
          review: String,
        },
      ],
      wishlist: [
        {
          type: Schema.Types.ObjectId,
          ref: "Perfume",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 12);
  }
  next();
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
