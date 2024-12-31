'use server';

import mongoose from 'mongoose';

import {
  IWaitlistDoc,
  Waitlist,
  WaitlistStatus,
} from '@/database/waitlist.model';

import { sendVerificationEmail, sendWaitlistNotification } from '../email';
import action from '../handlers/action';
import handleError from '../handlers/error';
import dbConnect from '../mongoose';
import {
  CreateWaitlistSchema,
  GetWaitlistSchema,
  NotifyWaitlistSchema,
  VerifyEmailSchema,
} from '../validations';

export async function createWaitlist(
  params: CreateWaitlistParams
): Promise<ActionResponse<IWaitlistDoc>> {
  const validationResult = await action({
    params,
    schema: CreateWaitlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, email } = validationResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [waitlist] = await Waitlist.create([{ name, email }], { session });

    if (!waitlist) {
      throw new Error('Failed to join waitlist');
    }

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(waitlist)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getWaitlist(
  params: GetWaitlistParams
): Promise<ActionResponse<IWaitlistDoc>> {
  const validationResult = await action({
    params,
    schema: GetWaitlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email } = validationResult.params!;

  try {
    const waitlist = await Waitlist.findOne({ email });

    if (!waitlist) {
      throw new Error('Waitlist not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(waitlist)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getWaitlists(): Promise<ActionResponse<IWaitlistDoc[]>> {
  try {
    const waitlists = await Waitlist.find();

    if (!waitlists) {
      throw new Error('No waitlists found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(waitlists)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function notifyWaitlistStatus(
  params: NotifyWaitlistsParams
): Promise<ActionResponse<IWaitlistDoc[]>> {
  const validationResult = await action({
    params,
    schema: NotifyWaitlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { emails } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const waitlists = await Waitlist.updateMany(
      { email: { $in: emails } },
      {
        notified: true,
        lastNotifiedAt: Date.now(),
        status: WaitlistStatus.NOTIFIED,
      },
      { session }
    );

    if (!waitlists) {
      throw new Error('Waitlists not found');
    }

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(waitlists)),
    };
  } catch (error: unknown) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function sendWaitlistEmails(params: NotifyWaitlistsParams) {
  const validationResult = await action({
    params,
    schema: NotifyWaitlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { emails } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // First, update the waitlist status
    const updateResult = await notifyWaitlistStatus({ emails });

    if (!updateResult.success) {
      throw new Error('Failed to update waitlist status');
    }

    // Send emails to each recipient
    const emailPromises = emails.map(async (email) => {
      // Get user details from waitlist
      const userResult = await getWaitlist({ email });

      if (!userResult.success) {
        console.error(`Failed to get details for ${email}`);
        return { email, success: false };
      }

      // Send the email
      const emailResult = await sendWaitlistNotification(
        email,
        userResult.data?.name
      );

      return {
        email,
        success: emailResult.success,
        error: emailResult.success ? null : emailResult.error,
      };
    });

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);

    // Count successes and failures
    const summary = results.reduce(
      (acc, result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          acc.successful.push(result.value.email);
        } else {
          acc.failed.push(
            result.status === 'fulfilled' ? result.value.email : 'unknown'
          );
        }
        return acc;
      },
      { successful: [] as string[], failed: [] as string[] }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: {
        totalProcessed: emails.length,
        successful: summary.successful,
        failed: summary.failed,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Error sending waitlist emails:', error);
    return {
      success: false,
      error: 'Failed to send waitlist emails',
    };
  } finally {
    await session.endSession();
  }
}

export async function verifyEmail(params: VerifyEmailParams) {
  const validationResult = await action({
    params,
    schema: VerifyEmailSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { token, email } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    // Find waitlist entry
    const waitlist = await Waitlist.findOne({
      email: email.toLowerCase(),
      verificationToken: token,
    });

    if (!waitlist) {
      throw new Error('Invalid verification link');
    }

    // Check if already verified
    if (waitlist.verified) {
      return {
        success: true,
        message: 'Email already verified',
      };
    }

    // Check if token is expired
    if (waitlist.isVerificationExpired()) {
      throw new Error('Verification link has expired');
    }

    // Update verification status
    waitlist.verified = true;
    waitlist.verifiedAt = new Date();
    waitlist.verificationToken = undefined;
    waitlist.verificationExpires = undefined;

    await waitlist.save();

    await session.commitTransaction();

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Error verifying email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify email',
    };
  } finally {
    await session.endSession();
  }
}

export async function resendVerification(params: { email: string }) {
  try {
    await dbConnect();

    const waitlist = await Waitlist.findOne({
      email: params.email.toLowerCase(),
    });

    if (!waitlist) {
      throw new Error('Email not found in waitlist');
    }

    if (waitlist.verified) {
      return {
        success: true,
        message: 'Email already verified',
      };
    }

    // Generate new verification token
    const token = waitlist.generateVerificationToken();
    await waitlist.save();

    // Send verification email
    await sendVerificationEmail(waitlist.email, waitlist.name, token);

    return {
      success: true,
      message: 'Verification email sent',
    };
  } catch (error) {
    console.error('Error resending verification:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to resend verification',
    };
  }
}
