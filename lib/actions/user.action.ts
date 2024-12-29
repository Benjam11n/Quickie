'use server';

import mongoose from 'mongoose';

import User from '@/database/user.model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { UpdateUserSchema } from '../validations';

export async function updateUser(
  params: UpdateUserParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateUserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, image, email, userId, isPrivate } =
    validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername && user.username !== username) {
      throw new Error('Username already exists');
    }

    if (
      user.name !== name ||
      user.username !== username ||
      user.email !== email ||
      user.image !== image ||
      user.isPrivate !== isPrivate
    ) {
      user.name = name;
      user.username = username;
      user.email = email;
      user.image = image;
      user.isPrivate = isPrivate;
      await user.save({ session });
    }

    const updatedUser = await User.findById(userId);

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
