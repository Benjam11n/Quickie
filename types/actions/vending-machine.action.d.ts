declare global {
  interface CreateVendingMachineParams {
    location: {
      type: 'Point';
      coordinates: [number, number];
      address: string;
      area: string;
    };
    inventory: {
      perfume: Types.ObjectId;
      stock: number;
      lastRefilled: Date;
    }[];
    status: 'active' | 'maintenance' | 'inactive';
    metrics: {
      totalSamples: number;
      popularTimes: Record<string, number>;
    };
  }

  interface UpdateVendingMachineParams extends CreateVendingMachineParams {
    vendingMachineId: string;
  }

  interface GetVendingMachineParams {
    vendingMachineId: string;
  }
}

export {};
