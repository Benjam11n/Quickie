'use server';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import Account from '@/database/account.model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { UpdateAccountSchema } from '../validations';

export async function updateAccount(
  params: UpdateAccountParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateAccountSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { oldPassword, newPassword, userId } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findOne({ userId })
      .select('+password')
      .session(session);
    if (!account) {
      throw new Error('Account not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      account.password
    );

    if (!isOldPasswordValid) {
      throw new Error('The current password was incorrect');
    }

    const isNewPasswordSame = await bcrypt.compare(
      newPassword,
      account.password
    );
    if (!isNewPasswordSame) {
      account.password = await bcrypt.hash(newPassword, 12);
      await account.save({ session });
    }

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
