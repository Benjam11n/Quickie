"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={images[selectedImage]}
            alt="Product"
            className="object-cover w-full h-full"
          />
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary",
              selectedImage === index && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedImage(index)}
          >
            <div className="aspect-square relative">
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
