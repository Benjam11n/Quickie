'use client';

import Autoplay from 'embla-carousel-autoplay';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { MousePointerClick } from 'lucide-react';
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
import { Perfume } from '@/types/models/fragrance';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

interface FeaturedPerfumesProps {
  perfumes?: Perfume[];
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

export function FeaturedPerfumes({
  perfumes,
  success,
  error,
}: FeaturedPerfumesProps) {
  return (
    <section className="container py-12">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Tonight&apos;s Specials
        </h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground">
          Discover our exclusive selection of perfumes curated for tonight. Each
          fragrance is crafted to evoke unique emotions and unforgettable
          memories.
        </p>
      </div>

      <div className="relative">
        {!success && (
          <div className="container py-12 text-center">
            <p className="text-red-500">
              {error?.message || 'Failed to load featured perfumes'}
            </p>
          </div>
        )}

        {!perfumes?.length && (
          <div className="container py-12 text-center">
            <p className="text-muted-foreground">
              No featured perfumes available
            </p>
          </div>
        )}

        <Carousel
          opts={{
            align: 'start',
            loop: true,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
            WheelGesturesPlugin({
              forceWheelAxis: 'x',
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {perfumes?.map((perfume, index) => (
              <CarouselItem
                key={index}
                className="pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4"
              >
                <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={perfume.images[0]}
                      alt={perfume.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                      <Button
                        size="sm"
                        className="mb-6 bg-white/90 text-black hover:bg-white/100"
                        asChild
                      >
                        <Link href={ROUTES.PRODUCT(perfume._id)} prefetch>
                          <MousePointerClick className="mr-1 size-4" />
                          View Perfume
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-xl">
                      {perfume.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {perfume.brand.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {perfume.description}
                    </p>
                    <p className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-lg font-bold text-transparent">
                      {perfume.fullPrice}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
