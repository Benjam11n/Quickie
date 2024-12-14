import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const featuredPerfumes = [
  {
    name: "Midnight Rendezvous",
    brand: "Quickie Signature",
    description: "A seductive affair of dark rose and vanilla bourbon",
    price: "$129.99",
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Morning After",
    brand: "Quickie Essentials",
    description: "Fresh and invigorating, like new beginnings",
    price: "$89.99",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Secret Affair",
    brand: "Quickie Reserve",
    description: "Mysterious amber wrapped in forbidden spices",
    price: "$149.99",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=60",
  },
];

export function FeaturedPerfumes() {
  return (
    <section className="container">
      <h2 className="text-3xl font-bold tracking-tight mb-8">
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
          Tonight's Specials
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPerfumes.map((perfume) => (
          <Card
            key={perfume.name}
            className="overflow-hidden hover-lift gradient-border"
          >
            <div className="aspect-square relative overflow-hidden group">
              <img
                src={perfume.image}
                alt={perfume.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <Button className="glow-effect" size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Take Me Home
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {perfume.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {perfume.brand}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {perfume.description}
              </p>
              <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
                {perfume.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
