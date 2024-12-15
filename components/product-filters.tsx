'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { brands, categories, notes } from '@/types/data';
import { FragranceFilters } from '@/types/fragrance';

interface ProductFiltersProps {
  filters: FragranceFilters;
  setFilters: (filters: FragranceFilters) => void;
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Price Range</h3>
        <div className="space-y-2">
          <Slider
            defaultValue={filters.priceRange}
            max={500}
            step={10}
            onValueChange={(value) =>
              setFilters({ ...filters, priceRange: value })
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      brands: [...filters.brands, brand],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      brands: filters.brands.filter((b) => b !== brand),
                    });
                  }
                }}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      categories: [...filters.categories, category],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      categories: filters.categories.filter(
                        (c) => c !== category
                      ),
                    });
                  }
                }}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Notes</h3>
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note} className="flex items-center space-x-2">
              <Checkbox
                id={`note-${note}`}
                checked={filters.notes.includes(note)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      notes: [...filters.notes, note],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      notes: filters.notes.filter((n) => n !== note),
                    });
                  }
                }}
              />
              <Label htmlFor={`note-${note}`}>{note}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
