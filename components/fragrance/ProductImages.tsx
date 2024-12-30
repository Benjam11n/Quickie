import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  images: string[];
  alt: string;
}

export function ProductImages({ images, alt }: ProductImageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const autoplayOptions = {
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };

  const wheelGestures = WheelGesturesPlugin({
    forceWheelAxis: 'x',
  });

  const [mainViewRef, mainEmbla] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: true,
      dragFree: false,
    },
    [Autoplay(autoplayOptions), wheelGestures]
  );

  const [thumbViewRef, thumbEmbla] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    axis: 'x',
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmbla || !thumbEmbla) return;
      mainEmbla.scrollTo(index);
    },
    [mainEmbla, thumbEmbla]
  );

  const onSelect = useCallback(() => {
    if (!mainEmbla || !thumbEmbla) return;

    const index = mainEmbla.selectedScrollSnap();
    setSelectedIndex(index);
    thumbEmbla.scrollTo(index);

    setCanScrollPrev(mainEmbla.canScrollPrev());
    setCanScrollNext(mainEmbla.canScrollNext());
  }, [mainEmbla, thumbEmbla]);

  useEffect(() => {
    if (!mainEmbla) return;

    mainEmbla.on('select', onSelect);
    onSelect();

    return () => {
      mainEmbla.off('select', onSelect);
    };
  }, [mainEmbla, onSelect]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="mx-auto w-full max-w-lg rounded-lg">
        <div className="relative">
          <div className="overflow-hidden" ref={mainViewRef}>
            <div className="flex touch-pan-y">
              {images.map((image, index) => (
                <div
                  className="relative aspect-square min-w-0 flex-[0_0_100%] rounded-lg"
                  key={index}
                >
                  <Image
                    src={image}
                    alt={`${alt} - View ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute left-4 top-1/2 size-8 -translate-y-1/2 rounded-full',
              !canScrollPrev && 'hidden'
            )}
            onClick={() => mainEmbla?.scrollPrev()}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute right-4 top-1/2 size-8 -translate-y-1/2 rounded-full',
              !canScrollNext && 'hidden'
            )}
            onClick={() => mainEmbla?.scrollNext()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </Card>

      <div className="mx-auto w-full max-w-lg">
        <div className="overflow-hidden" ref={thumbViewRef}>
          <div className="flex touch-pan-y gap-2 p-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={cn(
                  'relative size-16 flex-[0_0_auto] overflow-hidden rounded-md',
                  'cursor-pointer transition-all duration-200',
                  'hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  selectedIndex === index
                    ? 'opacity-100 ring-2 ring-primary'
                    : 'opacity-60 hover:opacity-100'
                )}
                type="button"
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
