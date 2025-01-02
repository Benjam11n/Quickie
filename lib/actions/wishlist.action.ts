'use server';

import mongoose, { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';

import Wishlist from '@/database/wishlist.model';
import { Wishlist as WishlistType } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  AddToWishlistSchema,
  CreateWishlistSchema,
  DeleteWishlistSchema,
  GetUserWishlistsSchema,
  GetWishlistSchema,
  RemoveFromWishlistSchema,
  UpdateWishlistSchema,
} from '../validations';

export async function addToWishlist(
  params: AddToWishlistParams
): Promise<ActionResponse<WishlistType>> {
  const validationResult = await action({
    params,
    schema: AddToWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wishlistId, perfume, priority } = validationResult.params!;
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
    if (wishlist.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    // Add perfume to this specific wishlist
    await wishlist.addPerfume(
      new Types.ObjectId(perfume),
      { priority },
      { session }
    );

    await session.commitTransaction();

    // Get updated wishlist with populated data
    const updatedWishlist = await Wishlist.findById(wishlistId).populate({
      path: 'perfumes.perfume',
      select: 'name brand price images affiliateLink',
      populate: {
        path: 'brand',
        select: 'name',
      },
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
): Promise<ActionResponse<WishlistType>> {
  const validationResult = await action({
    params,
    schema: RemoveFromWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wishlistId, perfume } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    // Check authorization
    if (wishlist.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    await wishlist.removePerfume(new Types.ObjectId(perfume));

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
): Promise<ActionResponse<WishlistType>> {
  const validationResult = await action({
    params,
    schema: CreateWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, description } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [wishlist] = await Wishlist.create(
      [{ name, description, author: userId }],
      { session }
    );

    if (!wishlist) {
      throw new Error('Failed to create wishlist');
    }

    await session.commitTransaction();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'perfumes.perfume',
      select: 'name brand price images',
      populate: {
        path: 'brand',
        select: 'name',
      },
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
): Promise<ActionResponse<WishlistType>> {
  const validationResult = await action({
    params,
    schema: UpdateWishlistSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, wishlistId, description } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wishlist = await Wishlist.findById(wishlistId).session(session);

    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    if (wishlist.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (wishlist.name !== name || wishlist.description !== description) {
      wishlist.name = name;
      wishlist.description = description;
      await wishlist.save({ session });
    }

    await session.commitTransaction();

    const updatedWishlist = await Wishlist.findById(wishlistId).populate({
      path: 'perfumes.perfume',
      select: 'name brand price images affiliateLink',
      populate: {
        path: 'brand',
        select: 'name',
      },
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
): Promise<ActionResponse<SuccessDeleteResponse>> {
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
    return {
      success: true,
      data: { _id: deletedWishlist._id.toString(), userId },
    };
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
        path: 'perfumes.perfume',
        select: 'name brand price images affiliateLink fullPrice',
        populate: {
          path: 'brand',
          select: 'name',
        },
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
  params: GetUserWishlistsParams
): Promise<ActionResponse<WishlistType[]>> {
  const validationResult = await action({
    params,
    schema: GetUserWishlistsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const wishlists = await Wishlist.find({ author: userId })
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'perfumes.perfume',
        select: 'name brand price images affiliateLink notes',
        populate: [
          {
            path: 'brand',
            select: 'name',
          },
          {
            path: 'notes',
            select: 'name',
          },
        ],
      });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(wishlists)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
