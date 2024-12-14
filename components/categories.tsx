import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Droplets, Flower, Sun, Moon, Wind, Heart } from "lucide-react";

const categories = [
  {
    title: "First Date",
    description: "Fresh, Flirty, Unforgettable",
    icon: Droplets,
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    title: "Sweet Talk",
    description: "Seductive Florals & Sweet Nothings",
    icon: Flower,
    gradient: "from-pink-400 to-rose-500",
  },
  {
    title: "Day Play",
    description: "Light & Playful Adventures",
    icon: Sun,
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    title: "After Dark",
    description: "Mysterious & Irresistible",
    icon: Moon,
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    title: "Exotic Affair",
    description: "Spicy, Wild, Untamed",
    icon: Wind,
    gradient: "from-red-400 to-pink-500",
  },
  {
    title: "True Love",
    description: "When You're Ready to Commit",
    icon: Heart,
    gradient: "from-rose-400 to-red-500",
  },
];

export function Categories() {
  return (
    <section className="container">
      <h2 className="text-3xl font-bold tracking-tight mb-8">
        <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text">
          Pick Your Pleasure
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.title}
              className="hover-lift gradient-border group cursor-pointer overflow-hidden"
            >
              <CardHeader>
                <div
                  className={`rounded-full p-2 w-12 h-12 flex items-center justify-center bg-gradient-to-br ${category.gradient} transform transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-violet-500 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300">
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`h-2 w-full bg-gradient-to-r ${category.gradient} rounded-full transform origin-left transition-transform group-hover:scale-x-110`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
