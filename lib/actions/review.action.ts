'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import Review, { IReviewDoc } from '@/database/review.model';
import { MoodBoard as MoodBoardType, Review as ReviewType } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  CreateReviewSchema,
  GetReviewSchema,
  GetReviewsSchema,
  UpdateReviewSchema,
} from '../validations';

export async function createMoodBoard(
  params: CreateReviewParams
): Promise<ActionResponse<MoodBoardType>> {
  const validationResult = await action({
    params,
    schema: CreateReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeId, vendingMachineId, rating } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [review] = await Review.create(
      [{ perfumeId, vendingMachineId, rating, author: userId }],
      { session }
    );

    if (!review) {
      throw new Error('Failed to create review');
    }

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(review)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updateReview(
  params: UpdateReviewParams
): Promise<ActionResponse<IReviewDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { vendingMachineId, rating, reviewId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (
      review.vendingMachineId !== vendingMachineId ||
      review.rating !== rating
    ) {
      review.vendingMachineId = vendingMachineId;
      review.rating = rating;
      await review.save({ session });
    }

    await review.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(review)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function deleteReview(reviewId: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const deleteReview = await Review.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(reviewId),
      author: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!deleteReview) {
      throw new Error('Review not found');
    }

    revalidatePath('/reviews');
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// Additional actions for views and likes
export async function incrementViews(
  reviewId: string
): Promise<ActionResponse> {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedReview) {
      throw new Error('Review not found');
    }

    return { success: true, data: updatedReview };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function toggleLike(reviewId: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const review = await Review.findById(reviewId)
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'vendingMachineId',
        select: 'location',
      });
    if (!review) {
      throw new Error('Review not found');
    }

    // Implementation depends on how you want to track likes
    // This is a simple increment/decrement. You might want to track which users liked what
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    revalidatePath(`/reviews/${reviewId}`);
    return { success: true, data: updatedReview };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getReview(
  params: GetReviewParams
): Promise<ActionResponse<ReviewType>> {
  const validationResult = await action({
    params,
    schema: GetReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { reviewId } = validationResult.params!;

  try {
    const review = await Review.findById(reviewId)
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'vendingMachineId',
        select: 'location',
      });

    if (!review) {
      throw new Error('Review not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(review)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPerfumeReviews(
  params: GetReviewsParams & PaginatedSearchParams
): Promise<ActionResponse<{ reviews: ReviewType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetReviewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeId } = validationResult.params!;
  const { page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    // Get total count for pagination
    const totalReviews = await Review.countDocuments({ perfumeId });

    // Get reviews with populated author and sorted by date
    const reviews = await Review.find({ perfumeId })
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'vendingMachineId',
        select: 'location',
      })
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalReviews > skip + reviews.length;

    return {
      success: true,
      data: {
        reviews: JSON.parse(JSON.stringify(reviews)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
