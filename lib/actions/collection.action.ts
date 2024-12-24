'use server';

import mongoose, { Types } from 'mongoose';

import Collection, { ICollectionDoc } from '@/database/collection.model';
import { CollectionView } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  AddToCollectionSchema,
  GetCollectionSchema,
  RemoveFromCollectionSchema,
} from '../validations';

export async function addToCollection(
  params: AddToCollectionParams
): Promise<ActionResponse<ICollectionDoc>> {
  const validationResult = await action({
    params,
    schema: AddToCollectionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const collection = await Collection.findOne({ author: userId });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Check authorization
    if (collection.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    await collection.addPerfume(new Types.ObjectId(perfumeId), { session });
    await session.commitTransaction();

    const updatedCollection = await Collection.findOne({
      author: userId,
    }).populate({
      path: 'perfumes.perfumeId',
      select: 'name brand price images',
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedCollection)),
    };
  } catch (error: unknown) {
    await session.abortTransaction();

    if (
      error instanceof Error &&
      error.message === 'Perfume already in collection'
    ) {
      return {
        success: false,
        error: { message: 'This perfume is already in your collection' },
      };
    }
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function removeFromCollection(
  params: RemoveFromCollectionParams
): Promise<ActionResponse<ICollectionDoc>> {
  const validationResult = await action({
    params,
    schema: RemoveFromCollectionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const collection = await Collection.findOne({ author: userId });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Check authorization
    if (collection.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    await collection.removePerfume(new Types.ObjectId(perfumeId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(collection)),
    };
  } catch (error) {
    session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getCollection(
  params: GetCollectionParams
): Promise<ActionResponse<CollectionView>> {
  const validationResult = await action({
    params,
    schema: GetCollectionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const collection = await Collection.findOne({ author: userId })
      .populate({
        path: 'author',
        select: 'name image',
      })
      .populate({
        path: 'perfumes.perfumeId',
        select: '_id id name brand affiliateLink price images',
      });

    if (!collection) {
      throw new Error('Collection not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(collection)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
