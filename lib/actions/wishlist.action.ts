'use server';

import mongoose, { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';

import { IWishlistDoc } from '@/database';
import Wishlist from '@/database/wishlist.model';
import { Wishlist as WishlistType } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  AddToWishlistSchema,
  CreateWishlistSchema,
  DeleteWishlistSchema,
  GetWishlistSchema,
  GetWishlistsSchema,
  RemoveFromWishlistSchema,
  UpdateWishlistSchema,
} from '../validations';

export async function addToWishlist(
  params: AddToWishlistParams
): Promise<ActionResponse<IWishlistDoc>> {
  const validationResult = await action({
    params,
    schema: AddToWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wishlistId, perfumeId, notes, priority, priceAlert } =
    validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the specific wishlist
    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    // Check authorization
    if (wishlist.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    // Add perfume to this specific wishlist
    await wishlist.addPerfume(
      new Types.ObjectId(perfumeId),
      { notes, priority, priceAlert },
      { session }
    );

    await session.commitTransaction();

    // Get updated wishlist with populated data
    const updatedWishlist = await Wishlist.findById(wishlistId).populate({
      path: 'perfumes.perfumeId',
      select: 'name brand price images',
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedWishlist)),
    };
  } catch (error: unknown) {
    await session.abortTransaction();

    if (
      error instanceof Error &&
      error.message === 'Perfume already in wishlist'
    ) {
      return {
        success: false,
        error: { message: 'This perfume is already in this wishlist' },
      };
    }
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function removeFromWishlist(
  params: RemoveFromWishlistParams
): Promise<ActionResponse<IWishlistDoc>> {
  const validationResult = await action({
    params,
    schema: RemoveFromWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wishlistId, perfumeId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wishlist = await Wishlist.findOne({ wishlistId });

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    // Check authorization
    if (wishlist.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    await wishlist.removePerfume(new Types.ObjectId(perfumeId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(wishlist)),
    };
  } catch (error) {
    session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function createWishlist(
  params: CreateWishlistParams
): Promise<ActionResponse<IWishlistDoc>> {
  const validationResult = await action({
    params,
    schema: CreateWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, perfumes } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [wishlist] = await Wishlist.create(
      [{ name, perfumes, author: userId }],
      { session }
    );

    if (!wishlist) {
      throw new Error('Failed to create wishlist');
    }

    await session.commitTransaction();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'perfumes.perfumeId',
      select: 'name brand price images',
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(populatedWishlist)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updateWishlist(
  params: UpdateWishlistParams
): Promise<ActionResponse<IWishlistDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, perfumes, wishlistId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    if (wishlist.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    const hasChanges =
      wishlist.name !== name ||
      JSON.stringify(wishlist.perfumes) !== JSON.stringify(perfumes);

    if (hasChanges) {
      wishlist.name = name;
      wishlist.perfumes = perfumes;
      await wishlist.save({ session });
    }

    await session.commitTransaction();

    const updatedWishlist = await Wishlist.findById(wishlistId).populate({
      path: 'perfumes.perfumeId',
      select: 'name brand price images',
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedWishlist)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function deleteWishlist(
  params: DeleteWishlistParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wishlistId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedWishlist = await Wishlist.findOneAndDelete(
      {
        _id: new mongoose.Types.ObjectId(wishlistId),
        author: new mongoose.Types.ObjectId(userId),
      },
      { session }
    );

    if (!deletedWishlist) {
      throw new Error('Wishlist not found or unauthorized');
    }

    await session.commitTransaction();

    revalidatePath('/wishlists');
    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getWishlist(
  params: GetWishlistParams
): Promise<ActionResponse<WishlistType>> {
  const validationResult = await action({
    params,
    schema: GetWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wishlistId } = validationResult.params!;

  try {
    const wishlist = await Wishlist.findById(wishlistId)
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'perfumes.perfumeId',
        select: 'name brand price images',
      });

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(wishlist)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserWishlists(
  params: GetWishlistsParams & PaginatedSearchParams
): Promise<ActionResponse<{ wishlists: WishlistType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetWishlistsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;
  const { page = 1, pageSize = 10, query = '' } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const queryConditions = {
      author: new Types.ObjectId(userId),
      ...(query && {
        name: { $regex: new RegExp(query, 'i') },
      }),
    };

    // Get total count for pagination
    const totalWishlists = await Wishlist.countDocuments(queryConditions);

    // Get wishlists with populated data and sorted by date
    const wishlists = await Wishlist.find(queryConditions)
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'perfumes.perfumeId',
        select: 'name brand price images',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalWishlists > skip + wishlists.length;

    return {
      success: true,
      data: {
        wishlists: JSON.parse(JSON.stringify(wishlists)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
