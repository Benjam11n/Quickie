'use server';

import Note, { INoteDoc } from '@/database/note.model';

import handleError from '../handlers/error';

export async function getNotes(): Promise<ActionResponse<INoteDoc[]>> {
  try {
    const notes = await Note.find();

    if (!notes) {
      throw new Error('Notes not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(notes)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
