'use server';

import mongoose, { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';

import ReviewInteraction, {
  ReviewInteractionCounts,
} from '@/database/review-interaction.model';
import Review, { IReviewDoc } from '@/database/review.model';
import { Review as ReviewType, ReviewView } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  CreateReviewSchema,
  DeleteReviewSchema,
  GetPerfumeReviewsSchema,
  GetReviewInteractionsSchema,
  GetReviewSchema,
  GetUserReviewsSchema,
  ReviewInteractionSchema,
  UpdateReviewSchema,
} from '../validations';

export async function createReview(
  params: CreateReviewParams
): Promise<ActionResponse<IReviewDoc>> {
  const validationResult = await action({
    params,
    schema: CreateReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    perfume,
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
          perfume,
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
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    // Delete review and all associated interactions
    await Promise.all([
      Review.findByIdAndDelete(reviewId),
      ReviewInteraction.deleteMany({ reviewId }),
    ]);

    await session.commitTransaction();
    revalidatePath('/reviews');

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function handleReviewInteraction(
  params: ReviewInteractionParams
): Promise<ActionResponse<ReviewInteractionCounts>> {
  const validationResult = await action({
    params,
    schema: ReviewInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { reviewId, type } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // For like/dislike, remove any existing opposite interaction
    if (type === 'like' || type === 'dislike') {
      await ReviewInteraction.deleteOne({
        author: userId,
        reviewId,
        type: type === 'like' ? 'dislike' : 'like',
      });
    }

    // Handle toggle for like/dislike
    const existingInteraction = await ReviewInteraction.findOne({
      author: userId,
      reviewId,
      type,
    });

    if (existingInteraction) {
      if (type === 'like' || type === 'dislike') {
        // Toggle like/dislike off
        await ReviewInteraction.deleteOne({ _id: existingInteraction._id });
      }
    } else {
      // Create new interaction
      await ReviewInteraction.create({
        author: userId,
        reviewId,
        type,
      });
    }

    // Get updated counts
    const [likesCount, dislikesCount, sharesCount, reportsCount] =
      await Promise.all([
        ReviewInteraction.countDocuments({ reviewId, type: 'like' }),
        ReviewInteraction.countDocuments({ reviewId, type: 'dislike' }),
        ReviewInteraction.countDocuments({ reviewId, type: 'share' }),
        ReviewInteraction.countDocuments({ reviewId, type: 'report' }),
      ]);

    await session.commitTransaction();

    return {
      success: true,
      data: {
        like: likesCount,
        dislike: dislikesCount,
        share: sharesCount,
        report: reportsCount,
      },
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getReviewInteractions(
  params: getReviewInteractionsParams
): Promise<ActionResponse<ReviewInteractionCounts>> {
  const validationResult = await action({
    params,
    schema: GetReviewInteractionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { reviewId } = validationResult.params!;

  try {
    const interactions = await ReviewInteraction.aggregate([
      { $match: { reviewId: new Types.ObjectId(reviewId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = interactions.reduce(
      (acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      },
      { like: 0, dislike: 0, share: 0, report: 0 }
    );

    return {
      success: true,
      data: counts,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getReview(
  params: GetReviewParams
): Promise<ActionResponse<ReviewView>> {
  const validationResult = await action({
    params,
    schema: GetReviewSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfume, userId: author } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const review = await Review.findOne({ perfume, author })
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

export async function getUserReviews(
  params: GetUserReviewsParams & PaginatedSearchParams
): Promise<ActionResponse<{ reviews: ReviewView[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserReviewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;
  const { page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    // Get total count for pagination
    const totalReviews = await Review.countDocuments({ author: userId });

    // Get reviews with populated author and sorted by date
    const reviews = await Review.find({ author: userId })
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'perfume',
        select: 'name images brand price',
        populate: {
          path: 'brand',
          select: 'name',
        },
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

export async function getPerfumeReviews(
  params: GetPerfumeReviewsParams & PaginatedSearchParams
): Promise<ActionResponse<{ reviews: ReviewType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetPerfumeReviewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfume } = validationResult.params!;
  const { page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    // Get total count for pagination
    const totalReviews = await Review.countDocuments({ perfume });

    // Get reviews with populated author and sorted by date
    const reviews = await Review.find({ perfume })
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
