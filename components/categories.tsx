import { Droplets, Flower, Sun, Moon, Wind, Heart } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const categories = [
  {
    title: 'First Date',
    description: 'Fresh, Flirty, Unforgettable',
    icon: Droplets,
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Sweet Talk',
    description: 'Seductive Florals & Sweet Nothings',
    icon: Flower,
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    title: 'Day Play',
    description: 'Light & Playful Adventures',
    icon: Sun,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    title: 'After Dark',
    description: 'Mysterious & Irresistible',
    icon: Moon,
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    title: 'Exotic Affair',
    description: 'Spicy, Wild, Untamed',
    icon: Wind,
    gradient: 'from-red-400 to-pink-500',
  },
  {
    title: 'True Love',
    description: "When You're Ready to Commit",
    icon: Heart,
    gradient: 'from-rose-400 to-red-500',
  },
];

export function Categories() {
  return (
    <section className="container">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">
        <span className="holographic-text">Pick Your Pleasure</span>
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.title}
              className="hover-lift group cursor-pointer overflow-hidden duration-300"
            >
              <CardHeader>
                <div
                  className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br p-2 ${category.gradient} my-2 transition-transform lg:group-hover:scale-110`}
                >
                  <Icon className="size-6 text-white" />
                </div>
                <CardTitle className="transition-all duration-300 group-hover:bg-gradient-to-r">
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`h-2 w-full bg-gradient-to-r ${category.gradient} origin-left rounded-full transition-transform`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
