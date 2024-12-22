'use server';

import mongoose, { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import MoodBoard, { IMoodBoardDoc } from '@/database/moodboard.model';
import TagMoodBoard from '@/database/tag-moodboard.model';
import Tag, { ITagDoc } from '@/database/tag.model';
import { MoodBoard as MoodBoardType } from '@/types';
import {
  CreateMoodBoardParams,
  GetMoodBoardParams,
  UpdateMoodBoardParams,
  UpdatePerfumePositionParams,
} from '@/types/action';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  GetMoodBoardSchema,
  MoodBoardSchema,
  PaginatedSearchParamsSchema,
  UpdateMoodBoardSchema,
} from '../validations';

export async function createMoodBoard(
  params: CreateMoodBoardParams
): Promise<ActionResponse<MoodBoardType>> {
  const validationResult = await action({
    params,
    schema: MoodBoardSchema,
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
    const [moodboard] = await MoodBoard.create(
      [{ name, description, tags, userId }],
      { session }
    );

    if (!moodboard) {
      throw new Error('Failed to create moodboard');
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagMoobBoardDocuments = [];

    if (tags) {
      for (const tag of tags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(tag, 'i') } },
          { $setOnInsert: { name: tag }, $inc: { count: 1 } },
          { upsert: true, new: true, session }
        );

        tagIds.push(existingTag._id);
        tagMoobBoardDocuments.push({
          tagId: existingTag._id,
          moodboard: moodboard._id,
        });
      }

      await TagMoodBoard.insertMany(tagMoobBoardDocuments, { session });

      await MoodBoard.findByIdAndUpdate(
        moodboard._id,
        { $push: { tags: { $each: tagIds } } },
        { session }
      );
    }

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(moodboard)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updateMoodBoard(
  params: UpdateMoodBoardParams
): Promise<ActionResponse<IMoodBoardDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateMoodBoardSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, description, tags, boardId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const moodboard = await MoodBoard.findById(boardId).populate('tags');

    if (!moodboard) {
      throw new Error('moodboard not found');
    }

    if (moodboard.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (moodboard.name !== name || moodboard.description !== description) {
      moodboard.name = name;
      moodboard.description = description;
      await moodboard.save({ session });
    }

    const tagsToAdd =
      tags?.filter(
        (tag) =>
          !moodboard.tags.some((t: ITagDoc) =>
            t.name.toLowerCase().includes(tag.toLowerCase())
          )
      ) || [];

    const tagsToRemove =
      moodboard.tags?.filter(
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
            moodboard: boardId,
          });

          moodboard.tags.push(existingTag._id);
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

      await TagMoodBoard.deleteMany(
        { tag: { $in: tagIdsToRemove }, moodboard: boardId },
        { session }
      );

      moodboard.tags = moodboard.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    if (newTagDocuments.length > 0) {
      await TagMoodBoard.insertMany(newTagDocuments, { session });
    }

    await moodboard.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(moodboard)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updatePerfumePosition(
  params: UpdatePerfumePositionParams
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const board = await MoodBoard.findOne({
      _id: new mongoose.Types.ObjectId(params.boardId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!board) {
      throw new Error('Mood board not found');
    }

    const updatedBoard = await MoodBoard.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(params.boardId),
        'perfumes.perfumeId': new mongoose.Types.ObjectId(params.perfumeId),
      },
      {
        $set: {
          'perfumes.$.position': params.position,
        },
      },
      { new: true }
    );

    if (!updatedBoard) {
      // If perfume wasn't found in the array, add it
      const boardWithNewPerfume = await MoodBoard.findByIdAndUpdate(
        params.boardId,
        {
          $push: {
            perfumes: {
              perfumeId: new mongoose.Types.ObjectId(params.perfumeId),
              position: params.position,
            },
          },
        },
        { new: true }
      );

      revalidatePath(`/moodboards/${params.boardId}`);
      return { success: true, data: boardWithNewPerfume };
    }

    revalidatePath(`/moodboards/${params.boardId}`);
    return { success: true, data: updatedBoard };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deletePerfumeFromBoard(
  boardId: string,
  perfumeId: string
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const updatedBoard = await MoodBoard.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(boardId),
        userId: new mongoose.Types.ObjectId(session.user.id),
      },
      {
        $pull: {
          perfumes: {
            perfumeId: new mongoose.Types.ObjectId(perfumeId),
          },
        },
      },
      { new: true }
    );

    if (!updatedBoard) {
      throw new Error('Mood board not found');
    }

    revalidatePath(`/moodboards/${boardId}`);
    return { success: true, data: updatedBoard };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteMoodBoard(
  boardId: string
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const deletedBoard = await MoodBoard.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(boardId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!deletedBoard) {
      throw new Error('Mood board not found');
    }

    revalidatePath('/moodboards');
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// Additional actions for views and likes
export async function incrementViews(boardId: string): Promise<ActionResponse> {
  try {
    const updatedBoard = await MoodBoard.findByIdAndUpdate(
      boardId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedBoard) {
      throw new Error('Mood board not found');
    }

    return { success: true, data: updatedBoard };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function toggleLike(boardId: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const board = await MoodBoard.findById(boardId);
    if (!board) {
      throw new Error('Mood board not found');
    }

    // Implementation depends on how you want to track likes
    // This is a simple increment/decrement. You might want to track which users liked what
    const updatedBoard = await MoodBoard.findByIdAndUpdate(
      boardId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    revalidatePath(`/moodboards/${boardId}`);
    return { success: true, data: updatedBoard };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getMoodBoard(
  params: GetMoodBoardParams
): Promise<ActionResponse<MoodBoardType>> {
  const validationResult = await action({
    params,
    schema: GetMoodBoardSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { boardId } = validationResult.params!;

  try {
    const moodboard = await MoodBoard.findById(boardId).populate('tags');

    if (!moodboard) {
      throw new Error('Mood Board not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(moodboard)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getMoodBoards(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ moodboards: MoodBoardType[]; isNext: boolean }>> {
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

  const filterQuery: FilterQuery<typeof MoodBoard> = {};

  if (filter === 'recommended') {
    return { success: true, data: { moodboards: [], isNext: false } };
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
    const totalMoodBoards = await MoodBoard.countDocuments(filterQuery);

    const moodboards = await MoodBoard.find(filterQuery)
      .populate('tags', 'name')
      .populate('author', 'name image')
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalMoodBoards > skip + moodboards.length;

    return {
      success: true,
      data: { moodboards: JSON.parse(JSON.stringify(moodboards)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}