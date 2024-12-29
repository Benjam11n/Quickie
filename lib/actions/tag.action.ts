'use server';

import Tag, { ITagDoc } from '@/database/tag.model';

import handleError from '../handlers/error';

export async function getTags(): Promise<ActionResponse<ITagDoc[]>> {
  try {
    const tags = await Tag.find();

    if (!tags) {
      throw new Error('Tags not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
