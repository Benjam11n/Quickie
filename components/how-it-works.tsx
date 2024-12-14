import { Card } from "@/components/ui/card";
import { MapPin, Sparkles, Star, User } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Find a Machine",
    description:
      "Locate our smart vending machines across the city using our interactive map.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "Try New Scents",
    description:
      "Sample premium fragrances in convenient travel-sized portions.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Share your thoughts and keep track of your favorites.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: User,
    title: "Build Collection",
    description:
      "Create your personal fragrance journey and discover new favorites.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function HowItWorks() {
  return (
    <section className="container">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Experience fragrance discovery reimagined through our innovative
          vending machines and digital platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.title}
              className="p-6 hover-lift gradient-border relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${step.gradient}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-xl">
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
