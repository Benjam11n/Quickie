export interface Position {
  x: number;
  y: number;
}

export interface MoodBoard {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  perfumes: {
    id: string;
    position: Position;
  }[];
  isPublic: boolean;
  shareUrl?: string;
}

export interface VendingLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string;
  stockLevel: number;
  availablePerfumes: {
    productId: string;
    quantity: number;
  }[];
}
