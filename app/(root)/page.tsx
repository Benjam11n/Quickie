import { Categories } from '@/components/Categories';
import {
  Features,
  Hero,
  HowItWorks,
  VendingLocations,
  FeaturedPerfumes,
} from '@/components/home';

export default async function Home() {
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
