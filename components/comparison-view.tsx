"use client";

import { useParams } from "next/navigation";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScentProfile } from "@/components/scent-profile";
import { ScentPyramid } from "@/components/scent-pyramid";
import { StarRating } from "@/components/star-rating";
import { useUserPerfumes } from "@/hooks/use-user-perfumes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ComparisonViewProps {
  product1: Product;
  product2: Product;
}

export function ComparisonView({ product1, product2 }: ComparisonViewProps) {
  const { collections } = useUserPerfumes();

  const userPerfume1 = collections.find((p) => p.productId === product1.id);
  const userPerfume2 = collections.find((p) => p.productId === product2.id);

  const compareValue = (value1: number, value2: number) => {
    if (value1 === value2) return "equal";
    return value1 > value2 ? "better" : "worse";
  };

  const getValueClass = (comparison: string) => {
    switch (comparison) {
      case "better":
        return "text-green-500";
      case "worse":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/catalog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Compare Fragrances</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[product1, product2].map((product, index) => {
          const userPerfume = index === 0 ? userPerfume1 : userPerfume2;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 space-y-6">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <p className="text-muted-foreground">{product.brand}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={getValueClass(
                        compareValue(
                          product.price,
                          index === 0 ? product2.price : product1.price
                        )
                      )}
                    >
                      ${product.price}
                    </span>
                    {userPerfume?.rating && (
                      <StarRating rating={userPerfume.rating} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Scent Profile Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <ScentProfile profile={product1.scentProfile} />
            <ScentProfile profile={product2.scentProfile} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Note Pyramid Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <ScentPyramid notes={product1.notes} />
            <ScentPyramid notes={product2.notes} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Detailed Comparison</h3>
        <div className="space-y-4">
          {Object.entries(product1.scentProfile).map(([key, value1]) => {
            const value2 =
              product2.scentProfile[key as keyof typeof product2.scentProfile];
            const comparison = compareValue(value1, value2);

            return (
              <div key={key} className="grid grid-cols-3 gap-4 items-center">
                <div className={getValueClass(comparison)}>{value1}%</div>
                <div className="text-center font-medium capitalize">{key}</div>
                <div
                  className={getValueClass(compareValue(value2, value1))}
                  style={{ textAlign: "right" }}
                >
                  {value2}%
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
