import { MapPin, Sparkles, Star, User } from 'lucide-react';

import { Card } from '@/components/ui/card';

const steps = [
  {
    icon: MapPin,
    title: 'Find a Machine',
    description:
      'Locate our smart vending machines across the city using our interactive map.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Sparkles,
    title: 'Try New Scents',
    description:
      'Sample premium fragrances in convenient travel-sized portions.',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'Share your thoughts and keep track of your favorites.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: User,
    title: 'Build Collection',
    description:
      'Create your personal fragrance journey and discover new favorites.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export function HowItWorks() {
  return (
    <section className="container">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          How It Works
        </h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground">
          Experience fragrance discovery reimagined through our innovative
          vending machines and digital platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.title}
              className="hover-lift group relative overflow-hidden p-6"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              <div className="space-y-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient}`}
                >
                  <Icon className="size-6 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
