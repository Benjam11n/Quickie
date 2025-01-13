'use server';

import mongoose, { FilterQuery, Types } from 'mongoose';
import { revalidatePath } from 'next/cache';

import Perfume, { IPerfumeDoc } from '@/database/perfume.model';
import ReviewInteraction, {
  ReviewInteractionCounts,
} from '@/database/review-interaction.model';
import Review, { IReviewDoc } from '@/database/review.model';
import VendingMachine from '@/database/vending-machine.model';
import { Review as ReviewType } from '@/types';

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

interface RatingUpdateQuery {
  $set: {
    'rating.average': number;
  };
  $inc?: {
    [key: string]: number;
  };
}

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

    const averageRating =
      (rating.complexity +
        rating.longevity +
        rating.sillage +
        rating.uniqueness +
        rating.value) /
      5;

    const perfumeDoc = (await Perfume.findById(perfume).select(
      'rating'
    )) as IPerfumeDoc;
    const currentCount = perfumeDoc?.rating?.count || 0;
    const currentTotal = (perfumeDoc?.rating?.average || 0) * currentCount;

    const newTotal = currentTotal + averageRating;
    const newCount = currentCount + 1;
    const newAverage = newTotal / newCount;

    await Perfume.findByIdAndUpdate(
      perfume,
      {
        $inc: {
          'rating.count': 1,
          [`rating.distribution.${Math.ceil(averageRating)}`]: 1,
        },
        $set: {
          'rating.average': newAverage,
        },
      },
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
      throw new Error('Review not found');
    }

    if (review.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    const originalRating = review.rating;
    const originalAverageRating =
      (originalRating.complexity +
        originalRating.longevity +
        originalRating.sillage +
        originalRating.uniqueness +
        originalRating.value) /
      5;

    if (
      review.vendingMachineId !== vendingMachineId ||
      JSON.stringify(review.rating) !== JSON.stringify(rating) ||
      review.review !== reviewText
    ) {
      review.vendingMachineId = vendingMachineId;
      review.rating = rating;
      review.review = reviewText;
      await review.save({ session });
    }

    const newAverageRating =
      (rating.complexity +
        rating.longevity +
        rating.sillage +
        rating.uniqueness +
        rating.value) /
      5;

    const perfumeDoc = (await Perfume.findById(review.perfume).select(
      'rating'
    )) as IPerfumeDoc;
    const currentCount = perfumeDoc?.rating?.count || 0;
    const currentTotal = (perfumeDoc?.rating?.average || 0) * currentCount;

    const newTotal = currentTotal - originalAverageRating + newAverageRating;
    const newAverage = newTotal / currentCount;

    const ratingUpdateQuery: RatingUpdateQuery = {
      $set: {
        'rating.average': newAverage,
      },
    };

    if (Math.ceil(originalAverageRating) !== Math.ceil(newAverageRating)) {
      ratingUpdateQuery.$inc = {
        [`rating.distribution.${Math.ceil(originalAverageRating)}`]: -1,
        [`rating.distribution.${Math.ceil(newAverageRating)}`]: 1,
      };
    }

    await Perfume.findByIdAndUpdate(review.perfume, ratingUpdateQuery, {
      session,
    });

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

    const averageRating =
      (review.rating.complexity +
        review.rating.longevity +
        review.rating.sillage +
        review.rating.uniqueness +
        review.rating.value) /
      5;

    const perfumeDoc = (await Perfume.findById(review.perfume).select(
      'rating'
    )) as IPerfumeDoc;
    const currentCount = perfumeDoc?.rating?.count || 0;
    const currentTotal = (perfumeDoc?.rating?.average || 0) * currentCount;

    const newTotal = currentTotal - averageRating;
    const newCount = currentCount - 1;
    const newAverage = newCount === 0 ? 0 : newTotal / newCount;

    await Perfume.findByIdAndUpdate(
      review.perfume,
      {
        $inc: {
          'rating.count': -1,
          [`rating.distribution.${Math.ceil(averageRating)}`]: -1,
        },
        $set: {
          'rating.average': newAverage,
        },
      },
      { session }
    );

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
): Promise<ActionResponse<ReviewType>> {
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
  params: GetUserReviewsParams
): Promise<ActionResponse<{ reviews: ReviewType[]; total: number }>> {
  const validationResult = await action({
    params,
    schema: GetUserReviewsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, sortBy, query } = validationResult.params!;
  const filterQuery: FilterQuery<typeof Review> = { author: userId };

  // First, let's find the matching perfumes and vending machines
  let matchingPerfumeIds: Types.ObjectId[] = [];
  let matchingVendingMachineIds: Types.ObjectId[] = [];

  if (query) {
    // Find matching perfumes
    const matchingPerfumes = await Perfume.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { 'brand.name': { $regex: new RegExp(query, 'i') } },
      ],
    }).select('_id');
    matchingPerfumeIds = matchingPerfumes.map((p) => p._id);

    // Find matching vending machines
    const matchingVendingMachines = await VendingMachine.find({
      'location.address': { $regex: new RegExp(query, 'i') },
    }).select('_id');
    matchingVendingMachineIds = matchingVendingMachines.map((vm) => vm._id);

    // Update filter query to include matches
    if (matchingPerfumeIds.length > 0 || matchingVendingMachineIds.length > 0) {
      filterQuery.$or = [
        { perfume: { $in: matchingPerfumeIds } },
        { vendingMachineId: { $in: matchingVendingMachineIds } },
      ];
    }
  }

  let sortCriteria: Record<string, 1 | -1> = {};
  switch (sortBy) {
    case 'date-desc':
      sortCriteria = { createdAt: -1 };
      break;
    case 'date-asc':
      sortCriteria = { createdAt: 1 };
      break;
    case 'rating-desc':
      sortCriteria = { averageRating: -1 };
      break;
    case 'rating-asc':
      sortCriteria = { averageRating: 1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalReviews = await Review.countDocuments({ author: userId });

    const reviews = await Review.find(filterQuery)
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
      .sort(sortCriteria)
      .limit(100)
      .lean();

    return {
      success: true,
      data: {
        reviews: JSON.parse(JSON.stringify(reviews)),
        total: totalReviews,
      },
    };
  } catch (error) {
    console.error('Error in getUserReviews:', error);
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
