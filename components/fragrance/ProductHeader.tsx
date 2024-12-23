import { ArrowLeft } from 'lucide-react';

import { Button } from '../ui/button';

interface ProductHeaderProps {
  name: string;
  onBack: () => void;
}

export function ProductHeader({ name, onBack }: ProductHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft />
      </Button>
      <h1 className="text-3xl font-bold">{name}</h1>
    </div>
  );
}
