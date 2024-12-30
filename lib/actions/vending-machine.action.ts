'use server';

import mongoose, { FilterQuery } from 'mongoose';

import VendingMachine from '@/database/vending-machine.model';
import { VendingMachineView } from '@/types';

import action from '../handlers/action';
import handleError from '../handlers/error';
import {
  CreateVendingMachineSchema,
  GetVendingMachineSchema,
  PaginatedSearchParamsSchema,
  UpdateVendingMachineSchema,
} from '../validations';

export async function createVendingMachine(
  params: CreateVendingMachineParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVendingMachineSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { location, inventory, status, metrics } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [vendingMachine] = await VendingMachine.create(
      [{ location, inventory, status, metrics, author: userId }],
      { session }
    );

    if (!vendingMachine) {
      throw new Error('Failed to create vending machine');
    }

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(vendingMachine)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updateVendingMachine(
  params: UpdateVendingMachineParams
): Promise<ActionResponse<VendingMachineView>> {
  const validationResult = await action({
    params,
    schema: UpdateVendingMachineSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { location, inventory, status, metrics, vendingMachineId } =
    validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vendingMachine = await VendingMachine.findById(
      vendingMachineId
    ).populate({
      path: 'inventory.perfume',
      select: 'name brand price images description',
      populate: {
        path: 'brand',
        select: 'name',
      },
    });

    if (!vendingMachine) {
      throw new Error('Vending machine not found');
    }

    if (vendingMachine.author.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    // Update basic information if changed
    const hasBasicChanges =
      JSON.stringify(vendingMachine.location) !== JSON.stringify(location) ||
      vendingMachine.status !== status ||
      JSON.stringify(vendingMachine.metrics) !== JSON.stringify(metrics);

    if (hasBasicChanges) {
      vendingMachine.location = location;
      vendingMachine.status = status;
      vendingMachine.metrics = metrics;
    }

    // Simply update the inventory directly
    if (inventory) {
      vendingMachine.inventory = inventory.map((item) => ({
        perfume: item.perfume,
        stock: item.stock,
        lastRefilled: new Date(),
      }));
    }

    await vendingMachine.save({ session });
    await session.commitTransaction();

    // Return updated vending machine with populated data
    const updatedVendingMachine = await VendingMachine.findById(
      vendingMachineId
    )
      .populate({
        path: 'inventory.perfume',
        select: 'name brand price images description',
        populate: {
          path: 'brand',
          select: 'name',
        },
      })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedVendingMachine)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getVendingMachine(
  params: GetVendingMachineParams
): Promise<ActionResponse<VendingMachineView>> {
  const validationResult = await action({
    params,
    schema: GetVendingMachineSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { vendingMachineId } = validationResult.params!;

  try {
    const vendingMachine = await VendingMachine.findById(
      vendingMachineId
    ).populate({
      path: 'inventory.perfume',
      select: 'name brand price images description',
      populate: {
        path: 'brand',
        select: 'name',
      },
    });

    if (!vendingMachine) {
      throw new Error('Vending Machine not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(vendingMachine)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getVendingMachines(
  params: PaginatedSearchParams
): Promise<
  ActionResponse<{ vendingMachines: VendingMachineView[]; isNext: boolean }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, sortBy } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof VendingMachine> = {};

  if (query) {
    filterQuery.$or = [
      { 'location.address': { $regex: new RegExp(query, 'i') } },
    ];
  }

  let sortCriteria = {};
  switch (sortBy) {
    case 'name-desc':
      sortCriteria = { 'location.address': -1 };
      break;
    case 'name-asc':
      sortCriteria = { 'loation.address': 1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalVendingMachines = await VendingMachine.countDocuments();

    const vendingMachines = await VendingMachine.find(filterQuery)
      .populate({
        path: 'inventory.perfume',
        select: '_id id name brand price images',
        populate: {
          path: 'brand',
          select: 'name',
        },
      })
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalVendingMachines > skip + vendingMachines.length;

    return {
      success: true,
      data: {
        vendingMachines: JSON.parse(JSON.stringify(vendingMachines)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
