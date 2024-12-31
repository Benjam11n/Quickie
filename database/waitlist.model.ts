/* eslint-disable no-unused-vars */
import crypto from 'crypto';

import { Document, model, models, Schema } from 'mongoose';

export enum WaitlistStatus {
  PENDING = 'Pending',
  NOTIFIED = 'Notified',
  REPLIED = 'Replied',
}

export interface IWaitlist {
  email: string;
  name?: string;
  emailVerified: boolean;
  signedUpAt: Date;
  notified: boolean;
  lastNotifiedAt?: Date;

  verificationToken?: string;
  verificationExpires?: Date;
  verified: boolean;
  verifiedAt?: Date;
  generateVerificationToken: () => string;
  isVerificationExpired: () => boolean;

  status: WaitlistStatus;
}

export interface IWaitlistDoc extends IWaitlist, Document {}

const WaitlistSchema = new Schema<IWaitlist>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: false,
    },
    signedUpAt: {
      type: Date,
      default: Date.now,
    },
    notified: {
      type: Boolean,
      default: false,
    },
    lastNotifiedAt: {
      type: Date,
    },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    status: {
      type: String,
      enum: Object.values(WaitlistStatus),
      default: WaitlistStatus.PENDING,
    },
  },
  { timestamps: true }
);

WaitlistSchema.index({ status: 1 });
WaitlistSchema.index({ signedUpAt: 1 });

WaitlistSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

WaitlistSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  this.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Method to check if verification token is expired
WaitlistSchema.methods.isVerificationExpired = function () {
  return this.verificationExpires < new Date();
};

WaitlistSchema.statics.findByStatus = function (status: WaitlistStatus) {
  return this.find({ status });
};

export const Waitlist =
  models.Waitlist || model<IWaitlist>('Waitlist', WaitlistSchema);
