import { Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

const featuredPerfumes = [
  {
    name: 'Midnight Rendezvous',
    link: 'midnight-rendezvous',
    brand: 'Quickie Signature',
    description: 'A seductive affair of dark rose and vanilla bourbon',
    price: '$129.99',
    image:
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Morning After',
    link: 'morning-after',
    brand: 'Quickie Essentials',
    description: 'Fresh and invigorating, like new beginnings',
    price: '$89.99',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Secret Affair',
    link: 'secret-affair',
    brand: 'Quickie Reserve',
    description: 'Mysterious amber wrapped in forbidden spices',
    price: '$149.99',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=60',
  },
];

export function FeaturedPerfumes() {
  return (
    <section className="container">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Tonight&apos;s Specials
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPerfumes.map((perfume) => (
          <Card
            key={perfume.name}
            className="hover-lift overflow-hidden duration-300"
          >
            <div className="group relative aspect-square overflow-hidden">
              <Image
                src={perfume.image}
                alt={perfume.name}
                fill
                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button size="sm" asChild>
                  <Link href={ROUTES.PRODUCT(perfume.link)} prefetch>
                    <Bookmark className="mr-1 size-4" />
                    Add To Your Collection
                  </Link>
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {perfume.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {perfume.brand}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                {perfume.description}
              </p>
              <p className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-lg font-bold text-transparent">
                {perfume.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
