import Image from 'next/image';

import { Card } from '../ui/card';

interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <Card className="max-w-lg w-full mx-auto">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image src={src} alt={alt} fill className="size-full object-cover" />
      </div>
    </Card>
  );
}
