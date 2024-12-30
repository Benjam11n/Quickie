'use server';

import mongoose, { FilterQuery } from 'mongoose';

import Brand from '@/database/brand.model';
import Note from '@/database/note.model';
import Perfume, { IPerfumeDoc } from '@/database/perfume.model';
import TagPerfume from '@/database/tag-perfume.model';
import Tag, { ITagDoc } from '@/database/tag.model';
import { PerfumeView } from '@/types/fragrance';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  CreatePerfumeSchema,
  GetPerfumesByIdsSchema,
  GetPerfumeSchema,
  PaginatedSearchParamsSchema,
  UpdatePerfumeSchema,
} from '../validations';
import { getBrands } from './brand.action';
import { getNotes } from './note.action';
import { getTags } from './tag.action';

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

  const {
    name,
    brand,
    description,
    affiliateLink,
    images,
    notes,
    scentProfile,
    price,
    tags,
  } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [perfume] = await Perfume.create(
      [
        {
          name,
          brand,
          description,
          affiliateLink,
          images,
          notes,
          scentProfile,
          price,
          tags,
          author: userId,
        },
      ],
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
    const perfume = await Perfume.findById(perfumeId)
      .populate('tags')
      .populate({
        path: 'brand',
        select: 'name',
      })
      .populate({
        path: 'notes.top.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.middle.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.base.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      });

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
            perfume,
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
        { tag: { $in: tagIdsToRemove }, perfume },
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
): Promise<ActionResponse<PerfumeView>> {
  const validationResult = await action({
    params,
    schema: GetPerfumeSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeId } = validationResult.params!;

  try {
    const perfume = await Perfume.findById(perfumeId)
      .populate({ path: 'tags', select: 'name perfumesCount' })
      .populate({
        path: 'brand',
        select: 'name',
      })
      .populate({
        path: 'notes.top.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.middle.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.base.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      });

    if (!perfume) {
      throw new Error('Perfume not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(perfume)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPerfumesByIds(
  params: GetPerfumesByIdsParams
): Promise<ActionResponse<PerfumeView[]>> {
  const validationResult = await action({
    params,
    schema: GetPerfumesByIdsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { perfumeIds } = validationResult.params!;

  try {
    const perfumes = await Perfume.find({ _id: { $in: perfumeIds } })
      .populate('tags')
      .populate({
        path: 'brand',
        select: 'name',
      })
      .populate({
        path: 'notes.top.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.middle.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.base.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      });

    if (perfumes.length === 0) {
      throw new Error('No perfumes found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(perfumes)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPerfumesPaginated(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ perfumes: PerfumeView[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 12,
    query,
    sortBy,
    brands,
    notes,
    priceRange,
    tags,
  } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Perfume> = {};

  // Step 1: Handle brands filtering
  if (brands && brands.length > 0) {
    const brandNames = brands.split(',');
    const foundBrands = await Brand.find({ name: { $in: brandNames } }).select(
      '_id'
    );

    if (foundBrands.length === 0) {
      return handleError(new Error('No brands found')) as ErrorResponse;
    }

    // Map the brand names to their respective ObjectIds
    const brandIds = foundBrands.map((brand) => brand._id);

    // Add the brand ObjectIds to the filter query
    filterQuery.brand = { $in: brandIds };
  }

  // Step 2: Handle notes filtering
  if (notes && notes.length > 0) {
    const noteNames = notes.split(',');
    const foundNotes = await Note.find({ name: { $in: noteNames } }).select(
      '_id'
    );

    if (foundNotes.length === 0) {
      return handleError(new Error('No notes found')) as ErrorResponse;
    }

    const noteIds = foundNotes.map((note) => note._id);

    filterQuery.$or = [
      { 'notes.top.note': { $in: noteIds } },
      { 'notes.middle.note': { $in: noteIds } },
      { 'notes.base.note': { $in: noteIds } },
    ];
  }

  // Step 3: Handle tags filtering
  if (tags && tags.length > 0) {
    const tagNames = tags.split(',');
    const foundTags = await Tag.find({ name: { $in: tagNames } }).select('_id');

    if (foundTags.length === 0) {
      return handleError(new Error('No tags found')) as ErrorResponse;
    }

    const tagIds = foundTags.map((tag) => tag._id);

    filterQuery.tags = { $in: tagIds };
  }

  // Step 4: Handle price range filtering
  if (priceRange && priceRange.length > 0) {
    const [minPrice, maxPrice] = priceRange.split(',').map(Number);

    filterQuery.fullPrice = { $gte: minPrice, $lte: maxPrice };
  }

  // Step 5: Handle search
  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, 'i') } },
      { description: { $regex: new RegExp(query, 'i') } },
    ];
  }

  // Step 6: Set up sorting criteria
  // todo: add not sorting options
  let sortCriteria = {};
  switch (sortBy) {
    case 'price-desc':
      sortCriteria = { fullPrice: -1 };
      break;
    case 'price-asc':
      sortCriteria = { fullPrice: 1 };
      break;
    case 'name-desc':
      sortCriteria = { name: -1 };
      break;
    case 'name-asc':
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    // Step 7: Get the total number of perfumes
    const totalPerfumes = await Perfume.countDocuments(filterQuery);

    // Step 8: Query the perfumes with the constructed filter and sort criteria
    const perfumes = await Perfume.find(filterQuery)
      .populate({ path: 'tags', select: 'name perfumesCount' })
      .populate('author', 'name image')
      .populate({
        path: 'brand',
        select: 'name',
      })
      .populate({
        path: 'notes.top.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.middle.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .populate({
        path: 'notes.base.note',
        select: 'name family',
        populate: {
          path: 'family',
          select: 'name',
        },
      })
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // Step 9: Check if there are more perfumes to load
    const isNext = totalPerfumes > skip + perfumes.length;

    return {
      success: true,
      data: { perfumes: JSON.parse(JSON.stringify(perfumes)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPerfumeFilters() {
  const [tagsResponse, notesResponse, brandsResponse] = await Promise.all([
    getTags(),
    getNotes(),
    getBrands(),
  ]);

  const tags = tagsResponse?.data ?? [];
  const notes = notesResponse?.data ?? [];
  const brands = brandsResponse?.data ?? [];

  return { tags, notes, brands };
}
