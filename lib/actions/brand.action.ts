'use server';

import Brand, { IBrandDoc } from '@/database/brand.model';

import handleError from '../handlers/error';

export async function getBrands(): Promise<ActionResponse<IBrandDoc[]>> {
  try {
    const brands = await Brand.find();

    if (!brands) {
      throw new Error('Brands not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(brands)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
