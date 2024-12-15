'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import { CollectionGrid } from '@/components/collection-grid';
import { RatingsList } from '@/components/ratings-list';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { products } from '@/types/data';

type SortOption =
  | 'rating-desc'
  | 'rating-asc'
  | 'name-asc'
  | 'name-desc'
  | 'recent'
  | 'oldest';

export default function ProfilePage() {
  const { collections } = useUserPerfumes();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const favorites = collections.filter((item) => item.isFavorite);
  const inCollection = collections.filter((item) => item.inCollection);
  const rated = collections.filter((item) => item.rating !== undefined);

  const sortItems = (items: typeof collections) => {
    return [...items].sort((a, b) => {
      const productA = products.find((p) => p.id === a.productId);
      const productB = products.find((p) => p.id === b.productId);

      switch (sortBy) {
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'name-asc':
          return (productA?.name || '').localeCompare(productB?.name || '');
        case 'name-desc':
          return (productB?.name || '').localeCompare(productA?.name || '');
        case 'recent':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'oldest':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        default:
          return 0;
      }
    });
  };

  const filterItems = (items: typeof collections) => {
    return items.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      return (
        product?.name.toLowerCase().includes(search.toLowerCase()) ||
        product?.brand.toLowerCase().includes(search.toLowerCase())
      );
    });
  };

  const processItems = (items: typeof collections) => {
    return sortItems(filterItems(items));
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Your Fragrance Journey
            </span>
          </h1>
          <p className="text-muted-foreground">
            Track your collection, favorites, and reviews.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your perfumes..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="rating-asc">Lowest Rated</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="collection" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collection">
              My Collection ({inCollection.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="ratings">Ratings ({rated.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-8">
            <CollectionGrid
              items={processItems(inCollection)}
              products={products}
              emptyMessage="Your collection is empty. Start adding perfumes you own!"
            />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-8">
            <CollectionGrid
              items={processItems(favorites)}
              products={products}
              emptyMessage="You haven't added any favorites yet. Find some perfumes you love!"
            />
          </TabsContent>

          <TabsContent value="ratings" className="space-y-8">
            <RatingsList
              items={processItems(rated)}
              products={products}
              emptyMessage="You haven't rated any perfumes yet. Share your thoughts!"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
