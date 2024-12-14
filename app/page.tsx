import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { VendingLocations } from "@/components/vending-locations";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero />
      <HowItWorks />
      <Features />
      <VendingLocations />
    </div>
  );
}
