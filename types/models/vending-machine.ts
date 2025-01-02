export interface VendingMachine {
  _id: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    area: string;
  };
  inventory: {
    perfume: {
      _id: string;
      name: string;
      brand: { _id: string; name: string };
      price: number;
      images: string[];
    };
    stock: number;
    lastRefilled: Date;
  }[];
  status: 'active' | 'maintenance' | 'inactive';
  metrics: {
    totalSamples: number;
    popularTimes: Record<string, number>;
  };
  author: string;
}
