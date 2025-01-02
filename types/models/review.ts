/* eslint-disable no-unused-vars */
import { Rating } from './fragrance';

export interface Review {
  _id: string;
  author: string;
  perfume: {
    _id: string;
    name: string;
    brand: { name: string };
    images: string[];
    price: number;
  };
  vendingMachineId?: string;
  rating: Rating;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReviewInteraction {
  Like = 'like',
  Dislike = 'dislike',
  Share = 'share',
  Report = 'report',
}
