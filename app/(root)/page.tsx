import { Categories } from '@/components/categories';
import {
  Features,
  Hero,
  HowItWorks,
  VendingLocations,
  FeaturedPerfumes,
} from '@/components/home';

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-16">
      <Hero />
      <FeaturedPerfumes />
      <Categories />
      <HowItWorks />
      <Features />
      <VendingLocations />
    </div>
  );
}
