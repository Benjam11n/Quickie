'use server';

import mongoose, { FilterQuery } from 'mongoose';

import Perfume, { IPerfumeDoc } from '@/database/perfume.model';
import TagPerfume from '@/database/tag-perfume.model';
import Tag, { ITagDoc } from '@/database/tag.model';
import {
  CreatePerfumeParams,
  GetPerfumeParams,
  UpdatePerfumeParams,
} from '@/types/action';
import { Product } from '@/types/fragrance';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  CreatePerfumeSchema,
  GetPerfumeSchema,
  PaginatedSearchParamsSchema,
  UpdatePerfumeSchema,
} from '../validations';

export async function createPerfume(
  params: CreatePerfumeParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreatePerfumeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, description, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [perfume] = await Perfume.create(
      [{ name, description, tags, userId }],
      { session }
    );

    if (!perfume) {
      throw new Error('Failed to create perfume');
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagPerfumeDocuments = [];

    if (tags) {
      for (const tag of tags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(tag, 'i') } },
          { $setOnInsert: { name: tag }, $inc: { count: 1 } },
          { upsert: true, new: true, session }
        );

        tagIds.push(existingTag._id);
        tagPerfumeDocuments.push({
          tagId: existingTag._id,
          perfume: perfume._id,
        });
      }

      await TagPerfume.insertMany(tagPerfumeDocuments, { session });

      await Perfume.findByIdAndUpdate(
        perfume._id,
        { $push: { tags: { $each: tagIds } } },
        { session }
      );
    }

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(perfume)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updatePerfume(
  params: UpdatePerfumeParams
): Promise<ActionResponse<IPerfumeDoc>> {
  const validationResult = await action({
    params,
    schema: UpdatePerfumeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, description, tags, perfumeId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const perfume = await Perfume.findById(perfumeId).populate('tags');

    if (!perfume) {
      throw new Error('perfume not found');
    }

    if (perfume.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (perfume.name !== name || perfume.description !== description) {
      perfume.name = name;
      perfume.description = description;
      await perfume.save({ session });
    }

    const tagsToAdd =
      tags?.filter(
        (tag) =>
          !perfume.tags.some((t: ITagDoc) =>
            t.name.toLowerCase().includes(tag.toLowerCase())
          )
      ) || [];

    const tagsToRemove =
      perfume.tags?.filter(
        (tag: ITagDoc) =>
          !tags?.some((t) => t.toLowerCase() === tag.name.toLowerCase())
      ) || [];

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(tag, 'i') } },
          { $setOnInsert: { name: tag }, $inc: { count: 1 } },
          { upsert: true, new: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            tagId: existingTag._id,
            perfume: perfumeId,
          });

          perfume.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );

      await TagPerfume.deleteMany(
        { tag: { $in: tagIdsToRemove }, perfume: perfumeId },
        { session }
      );

      perfume.tags = perfume.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    if (newTagDocuments.length > 0) {
      await TagPerfume.insertMany(newTagDocuments, { session });
    }

    await perfume.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(perfume)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getPerfume(
  params: GetPerfumeParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: GetPerfumeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeId } = validationResult.params!;

  try {
    const perfume = await Perfume.findById(perfumeId).populate('tags');

    if (!perfume) {
      throw new Error('Perfume not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(perfume)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPerfumes(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ perfumes: Product[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Perfume> = {};

  if (filter === 'recommended') {
    return { success: true, data: { perfumes: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, 'i') } },
      { content: { $regex: new RegExp(query, 'i') } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case 'newest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'unanswered':
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case 'popular':
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalPerfumes = await Perfume.countDocuments(filterQuery);

    const perfumes = await Perfume.find(filterQuery)
      .populate('tags', 'name')
      // TODO: Implement this
      // .populate('author', 'name image')
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .then((products) =>
        products.map((product) => ({
          ...product,
          id: (product._id as mongoose.Types.ObjectId).toString(),
          _id: undefined, // Remove _id from the response
        }))
      );

    const isNext = totalPerfumes > skip + perfumes.length;

    return {
      success: true,
      data: { perfumes: JSON.parse(JSON.stringify(perfumes)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
