import {
  MapPin,
  Star,
  Sparkles,
  Heart,
  Clock,
  Zap,
  Share2,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    icon: MapPin,
    title: "Smart Locations",
    description:
      "Strategically placed machines in high-traffic areas for easy access",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Star,
    title: "Personal Ratings",
    description: "Keep track of your fragrance experiences and preferences",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Heart,
    title: "Collection Building",
    description: "Create and manage your personal fragrance collection",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your favorite scents whenever inspiration strikes",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Instant Sampling",
    description: "Try before you commit with our travel-sized portions",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: Share2,
    title: "Social Sharing",
    description: "Share your discoveries with the fragrance community",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Get personalized suggestions based on your preferences",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Trend Tracking",
    description: "Stay updated with popular fragrances in your area",
    gradient: "from-cyan-500 to-blue-500",
  },
];

export function Features() {
  return (
    <section className="container">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Why Choose Quickie
        </h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground">
          Experience the future of fragrance discovery with our innovative
          platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="hover-lift gradient-border group relative overflow-hidden p-6"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              <div className="space-y-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient}`}
                >
                  <Icon className="size-6 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
