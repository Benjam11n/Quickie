'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import Review, { IReviewDoc } from '@/database/review.model';
import { Review as ReviewType } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  CreateReviewSchema,
  DeleteReviewSchema,
  GetReviewSchema,
  GetReviewsSchema,
  LikeReviewSchema,
  UpdateReviewSchema,
} from '../validations';

export async function createReview(
  params: CreateReviewParams
): Promise<ActionResponse<ReviewType>> {
  const validationResult = await action({
    params,
    schema: CreateReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    perfumeId,
    vendingMachineId,
    review: writtenReview,
    rating,
  } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [review] = await Review.create(
      [
        {
          perfumeId,
          vendingMachineId,
          review: writtenReview,
          rating,
          author: userId,
        },
      ],
      { session }
    );

    if (!review) {
      throw new Error('Failed to create review');
    }

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(review)) };
  } catch (error) {
    // 11000 is MongoDB's duplicate key error code
    if ((error as { code?: number }).code === 11000) {
      return {
        success: false,
        error: {
          message: 'You have already reviewed this perfume',
        },
      };
    }
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
  const {
    vendingMachineId,
    rating,
    review: reviewText,
    reviewId,
  } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('review not found');
    }

    if (review.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (
      review.vendingMachineId !== vendingMachineId ||
      review.rating !== rating ||
      review.review !== reviewText
    ) {
      review.vendingMachineId = vendingMachineId;
      review.rating = rating;
      review.review = reviewText;
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

export async function deleteReview(
  params: DeleteReviewParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { reviewId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      author: userId,
    });

    if (deletedReview.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (!deletedReview) {
      throw new Error('Review not found');
    }

    session.commitTransaction();
    revalidatePath('/reviews');
    return { success: true };
  } catch (error) {
    session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function likeReview(
  params: LikeReviewParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: LikeReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { reviewId } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

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

    // Implementation depends on how you want to track likes
    // This is a simple increment/decrement. You might want to track which users liked what
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    session.commitTransaction();

    revalidatePath(`/reviews/${reviewId}`);
    return { success: true, data: JSON.parse(JSON.stringify(updatedReview)) };
  } catch (error) {
    session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function dislikeReview(
  params: LikeReviewParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: LikeReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { reviewId } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

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

    // Implementation depends on how you want to track likes
    // This is a simple increment/decrement. You might want to track which users liked what
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    session.commitTransaction();

    revalidatePath(`/reviews/${reviewId}`);
    return { success: true, data: JSON.parse(JSON.stringify(updatedReview)) };
  } catch (error) {
    session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
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

  const { perfumeId, userId: author } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const review = await Review.findOne({ perfumeId, author })
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'vendingMachineId',
        select: 'location',
      });

    if (!review || author !== userId) {
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
